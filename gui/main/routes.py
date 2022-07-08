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

from seldonian.dataset import SupervisedDataSet
from seldonian.spec import SupervisedSpec
from seldonian.models import model as models
from seldonian.parse_tree.operators import measure_functions_dict
from seldonian.parse_tree.parse_tree import ParseTree
from seldonian.utils.io_utils import save_pickle

math_operators = ['+','-','*','/']
math_functions = ['min()','max()','abs()','exp()']

main = Blueprint('main',__name__)

# @main.route("/",methods=["GET"]) 
# def index():
# 	form = DataUploadForm()
# 	return render_template('index.html',form=form)

@main.route("/gui",methods=["GET"]) 
def gui(): 
	print(f"Hit /gui with {request.method} method")
	
	setup_form = SetupForm()
	# setup_form.all_attributes.data = (
	# 	"M,F,SAT_Physics,SAT_Biology,SAT_History,"
	# 	"SAT_Second_Language, SAT_Geography,SAT_Literature,"
	# 	"SAT_Portuguese_and_Essay,SAT_Math, SAT_Chemistry, GPA_class")
	# setup_form.sensitive_attributes.data = "M,F"
	# setup_form.label_column.data = "GPA_class"

	# if 'dataset' in request.args
	return render_template('gui.html',setup_form=setup_form,
		measure_functions_dict=measure_functions_dict,
		math_operators=math_operators,
		math_functions=math_functions)


@main.route("/process_constraints",methods=["GET","POST"]) 
def process_constraints(): 
	print("Inside process_constraints()")
	# Get data from request
	data_file = request.files['data_file']
	if not data_file:
		# return jsonify(success=0,
		# 		error_msg=("Data file was empty"))
		print("Data file was empty")
	form_data = request.form
	regime = form_data['regime']
	constraint_strings = json.loads(form_data['constraint_strings'])
	delta_values = [float(x) for x in json.loads(form_data['delta_values'])]
	
	if regime == "supervised":
		sub_regime = form_data['sub_regime']
		sensitive_attributes = form_data['sensitive_attributes']
		all_attributes = form_data['all_attributes']
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
			model_class = models.LogisticRegressionModel
		elif sub_regime == 'regression':
			model_class = models.LinearRegressionModel

			# return jsonify(success=0,
			# 	error_msg=("Issue reading data file the parse tree for constraint: "
			# 			  f"{constraint_str}"))
	elif regime == 'RL':
		sub_regime = "all"
		sensitive_attributes = []

	parse_trees = []
	for ii in range(len(constraint_strings)):
		constraint_str = constraint_strings[ii]
		delta = delta_values[ii]
		pt = ParseTree(delta=delta,regime=regime,
			sub_regime=sub_regime,columns=sensitive_attributes)
		try:
			pt.create_from_ast(constraint_str)
		except Exception as e:
			print(e)
			return jsonify(success=0,
				error_msg=("Issue building the parse tree for constraint: "
						  f"{constraint_str}"))
	if regime == 'supervised':
		spec = SupervisedSpec(
				dataset=dataset,
				model_class=model_class,
				frac_data_in_safety=0.6,
				primary_objective=model_class.default_objective,
				initial_solution_fn=model_class.fit,
				parse_trees=parse_trees,
				)
		savename = './spec.pkl'
		save_pickle(savename,spec)
		msg = f"Saved {savename}"

	return jsonify(success=1,msg=msg)

