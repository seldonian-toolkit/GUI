from flask import (render_template, request, redirect, abort, Blueprint,
				   session, url_for, flash, session,
				   jsonify,current_app,send_from_directory)
from werkzeug.utils import secure_filename
from .forms import SetupForm
from .utils import allowed_file,parse_str_commasep
import numpy as np
import os
import json
import pandas as pd

from seldonian.dataset import (SupervisedDataSet,
	RLDataSet, DataSetLoader)
from seldonian.spec import SupervisedSpec, RLSpec
from seldonian.models import models,objectives
from seldonian.parse_tree.operators import measure_functions_dict
from seldonian.parse_tree.parse_tree import make_parse_trees_from_constraints
from seldonian.utils.io_utils import save_pickle

issues_url = "https://github.com/seldonian-toolkit/GUI/issues"
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
	frac_data_in_safety = 0.6 # --TODO-- make this a user input
	data_file = request.files['data_file']

	if not data_file:
		return jsonify(success=0,
				error_msg=("Data file was empty"))
		print("Data file was empty")
	form_data = request.form
	regime = form_data['regime']
	constraint_strs = json.loads(form_data['constraint_strings'])
	delta_values = [float(x) for x in json.loads(form_data['delta_values'])]
	try:

		if regime == "supervised_learning":
			sub_regime = form_data['sub_regime']

			sensitive_col_names = parse_str_commasep(form_data['sensitive_attributes'])
			all_col_names = parse_str_commasep(form_data['all_attributes'])
			label_col_names = parse_str_commasep(form_data['label_column'])
			feature_col_names = []
			for n in all_col_names:
				if (n in label_col_names) or (n in sensitive_col_names):
					continue
				feature_col_names.append(n)
			# feature_col_names = [x for x in all_col_names if (x not in label_col_names) and (x not in sensitive_col_names)]
			print("feature_col_names:")
			print(feature_col_names)
			print("label_col_names:")
			print(label_col_names)
			print("sensitive_col_names:")
			print(sensitive_col_names)
			df = pd.read_csv(data_file,header=None,names=all_col_names)

			features = df.loc[:,feature_col_names].values
			labels = np.squeeze(df.loc[:,label_col_names].values) # converts shape from (N,1) -> (N,) if only a single label column.
			sensitive_attrs = df.loc[:,sensitive_col_names].values
			num_datapoints = len(df)
			meta_information = {}
			meta_information['feature_col_names'] = feature_col_names
			meta_information['label_col_names'] = label_col_names
			meta_information['sensitive_col_names'] = sensitive_col_names
			meta_information['sub_regime'] = sub_regime

			dataset = SupervisedDataSet(
				features=features,
				labels=labels,
				sensitive_attrs=sensitive_attrs,
				num_datapoints=num_datapoints,
				meta_information=meta_information)
			
			if sub_regime == 'classification':
				model = models.BinaryLogisticRegressionModel()
				primary_objective = objectives.binary_logistic_loss
			elif sub_regime == 'regression':
				model = models.LinearRegressionModel()
				primary_objective = objectives.Mean_Squared_Error


		elif regime == 'reinforcement_learning':
			sub_regime = "all"
			sensitive_attributes = []
			sensitive_col_names = []
			# Dataset 
			loader = DataSetLoader(regime='reinforcement_learning')
			dataset = loader.load_RL_dataset_from_csv(
				filename=data_file,metadata_filename=None)

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
	
	except Exception as e:
		print(e)
		return jsonify(
			success=0,
			error_msg=(
				"Issue parsing your data or metadata. "
				"Please try again.")
			)

	try:
		parse_trees = make_parse_trees_from_constraints(
			constraint_strs,
			delta_values,
			regime=regime,
			sub_regime=sub_regime,
			columns=sensitive_col_names,
			delta_weight_method='equal')

	except Exception as e:
		print(e)
		return jsonify(
			success=0,
			error_msg=(
				"Issue building the parse trees for your constraints. "
				"Please try again.")
			)
	try:
		if regime == 'supervised_learning':
			spec = SupervisedSpec(
					dataset=dataset,
					model=model,
					sub_regime=sub_regime,
					frac_data_in_safety=frac_data_in_safety,
					primary_objective=primary_objective,
					initial_solution_fn=model.fit,
					parse_trees=parse_trees,
					)
			
		
		elif regime == 'reinforcement_learning':

			spec = RLSpec(
				dataset=dataset,
				model=RL_model,
				primary_objective=primary_objective,
				frac_data_in_safety=frac_data_in_safety,
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
	
	except Exception as e:
			print(e)

			return jsonify(
				success=0,
				error_msg=("Issue building the spec object. "
					"If this occurs, please raise an issue on github here:"
					f"{issues_url}. Please include as much information "
					"as possible about your inputs and the output "
					"logged in your terminal.")
				)
	savename = './spec.pkl'
	save_pickle(savename,spec)
	msg = f"Saved {savename}"
	print(msg)

	return jsonify(success=1,msg=msg)

