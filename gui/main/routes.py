from flask import (render_template, request, redirect, abort, Blueprint,
				   session, url_for, flash, session,
				   jsonify,current_app,send_from_directory)
from werkzeug.utils import secure_filename
from .forms import SetupForm
from .utils import allowed_file
import numpy as np
import os
import json
import pandas as pd

from seldonian.dataset import (SupervisedDataSet,
	RLDataSet, DataSetLoader)
from seldonian.spec import SupervisedSpec, RLSpec
from seldonian.models import models,objectives
from seldonian.parse_tree.operators import measure_functions_dict
from seldonian.parse_tree.parse_tree import ParseTree
from seldonian.utils.io_utils import save_pickle

measure_functions_eng_defs = {
	'PR': 'Positive rate',
	'NR': 'Negative rate',
	'FPR': 'False positive rate',
	'TPR': 'True positive rate',
	'FNR': 'False negative rate',
	'TNR': 'True negative rate',
	'logistic_loss': 'Logistic loss',
	'Mean_Error': 'Mean error',
	'Mean_Squared_Error': 'Mean squared error',
	'J_pi_new': 'Performance of new policy'
}

math_operators = ['+','-','*','/']
math_functions = ['min()','max()','abs()','exp()']

main = Blueprint('main',__name__)

@main.route("/",methods=["GET"]) 
@main.route("/gui",methods=["GET"]) 
def gui(): 
	""" The GUI page. """
	setup_form = SetupForm()
	setup_form.all_attributes.data = (
		"M,F,SAT_Physics,SAT_Biology,SAT_History,"
		"SAT_Second_Language, SAT_Geography,SAT_Literature,"
		"SAT_Portuguese_and_Essay,SAT_Math, SAT_Chemistry, GPA_class")
	setup_form.sensitive_attributes.data = "M,F"
	setup_form.label_column.data = "GPA_class"

	return render_template('gui.html',setup_form=setup_form,
		measure_functions_dict=measure_functions_dict,
		measure_functions_eng_defs=measure_functions_eng_defs,
		math_operators=math_operators,
		math_functions=math_functions)


@main.route("/process_constraints",methods=["GET","POST"]) 
def process_constraints(): 
	""" Handles POST requests from 
	GUI's submit button press. 
	Takes the user input from data/metadata setup
	and the constraints the user entered
	and creates a spec file """

	data_file = request.files['data_file']

	if not data_file:
		return jsonify(success=0,
				error_msg=("Data file was empty"))
		print("Data file was empty")
	form_data = request.form
	regime = form_data['regime']
	constraint_strings = json.loads(form_data['constraint_strings'])
	delta_values = [float(x) for x in json.loads(form_data['delta_values'])]
	
	if regime == "supervised_learning":
		sub_regime = form_data['sub_regime']
		sensitive_attributes = form_data['sensitive_attributes'].split(",")
		all_attributes = form_data['all_attributes'].split(",")
		label_column = form_data['label_column']

		df = pd.read_csv(data_file,header=None)	
		dataset = SupervisedDataSet(
			df=df,
			meta_information=all_attributes,
			label_column=label_column,
			sensitive_column_names=sensitive_attributes,
			include_sensitive_columns=False,
			include_intercept_term=True)
		
		if sub_regime == 'classification':
			model = models.LogisticRegressionModel()
			primary_objective = objectives.logistic_loss
		elif sub_regime == 'regression':
			model = models.LinearRegressionModel()
			primary_objective = objectives.Mean_Squared_Error

	elif regime == 'reinforcement_learning':
		sub_regime = "all"
		sensitive_attributes = []
		# Dataset 
		loader = DataSetLoader(regime='reinforcement_learning')
		dataset = loader.load_RL_dataset_from_csv(
			filename=data_file)
		env_module_name = form_data['env_module']
		env_class_name = form_data['env_class']
		agent_module_name = form_data['agent_module']
		agent_module_name = form_data['agent_module']
		
		# Get the RL environment class by name lookup
		RL_environment_module = importlib.import_module(
			f'seldonian.RL.environments.{env_module_name}')
		RL_environment_obj = getattr(
			RL_environment_module, env_class_name)(**env_kwargs)

		# Get the RL agent class by name lookup
		RL_agent_module = importlib.import_module(
			f'seldonian.RL.agents.{agent_module_name}')
		RL_agent_obj = getattr(
			RL_agent_module, agent_class_name)(**env_kwargs)

		RL_model_instance = RL_model(RL_agent_obj,RL_environment_obj)
		primary_objective = RL_model_instance.sample_IS_estimate

	parse_trees = []
	for ii in range(len(constraint_strings)):
		constraint_str = constraint_strings[ii]
		delta = delta_values[ii]
		pt = ParseTree(delta=delta,
			regime=regime,
			sub_regime=sub_regime,
			columns=sensitive_attributes)
		try:
			pt.build_tree(constraint_str)
		except Exception as e:
			print(e)
			return jsonify(success=0,
				error_msg=("Issue building the parse tree for constraint: "
						  f"{constraint_str}"))
	
	if regime == 'supervised_learning':
		spec = SupervisedSpec(
				dataset=dataset,
				model=model,
				sub_regime=sub_regime,
				frac_data_in_safety=0.6,
				primary_objective=primary_objective,
				initial_solution_fn=model.fit,
				parse_trees=parse_trees,
				)
	elif regime == 'reinforcement_learning':

		spec = RLSpec(
			dataset=dataset,
			model=RL_model,
			primary_objective=primary_objective,
			frac_data_in_safety=0.6,
			use_builtin_primary_gradient_fn=False,
			parse_trees=parse_trees,
			RL_environment_obj=RL_environment_obj,
			RL_agent_obj=RL_agent_obj,
			initial_solution_fn=None,
			optimization_technique='gradient_descent',
			optimizer='adam',
			optimization_hyperparams={
				'lambda_init': 0.5,
				'alpha_theta': 0.005,
				'alpha_lamb': 0.005,
				'beta_velocity': 0.9,
				'beta_rmsprop': 0.95,
				'num_iters': 30,
				'hyper_search': None,
				'gradient_library': 'autograd',
				'verbose': True,
			},
			regularization_hyperparams={},
			normalize_returns=False,
		)
	savename = './spec.pkl'
	save_pickle(savename,spec)
	msg = f"Saved {savename}"
	print(msg)

	return jsonify(success=1,msg=msg)

