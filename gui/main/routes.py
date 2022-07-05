from flask import (render_template, request, redirect, abort, Blueprint,
				   session, url_for, flash,
				   jsonify,current_app,send_from_directory)
from werkzeug.utils import secure_filename
from .forms import SetupForm
from .utils import allowed_file
import numpy as np
import os
import json

from seldonian.dataset import DataSetLoader
from seldonian.parse_tree.operators import measure_functions_dict
from seldonian.parse_tree.parse_tree import ParseTree


math_operators = ['+','-','*','/']
math_functions = ['min()','max()','abs()','exp()']

main = Blueprint('main',__name__)

@main.route("/",methods=["GET"]) 
@main.route("/gui",methods=["GET"]) 
def gui(): 
	print(f"Hit /gui with {request.method} method")
	setup_form = SetupForm()
	setup_form.sensitive_attributes.data = "M,F"

	return render_template('gui.html',setup_form=setup_form,
		measure_functions_dict=measure_functions_dict,
		math_operators=math_operators,
		math_functions=math_functions)

@main.route('/gui', methods=['POST'])
def upload_file():
	print(f"Hit /gui with {request.method} method")
	data_file = request.files['data-file-field']
	metadata_file = request.files['metadata-file-field']

	### Metadata
	if not metadata_file.filename.endswith('json'):
		flash("Metadata file must end with '.json'","danger")
		return redirect(url_for('main.gui'))	
	try:
		read = metadata_file.read()
		metadata_dict = json.loads(read)
	except:
		flash("Metadata file is not properly JSON formatted","danger")
		return redirect(url_for('main.gui'))	

	regime = metadata_dict['regime']
	setup_form = SetupForm()
	setup_form.regime.data = regime
	all_attrs = metadata_dict['columns']
	if regime == 'supervised':
		sub_regime = metadata_dict['sub_regime'] 
		sensitive_attrs = metadata_dict['sensitive_columns']

		setup_form.sub_regime.data = sub_regime
		setup_form.sensitive_attributes.data = ','.join(
		sensitive_attrs)

	setup_form.all_attributes.choices = all_attrs
	
	### Data
	loader = DataSetLoader(regime=regime)
	
	if regime == "supervised":
		df = pd.read_csv(data_file,header=None)
		label_column = metadata_dict['label_column']
		df.columns = all_attrs
		dataset = SupervisedDataSet(
			df=df,
			meta_information=all_attrs,
			label_column=label_column,
			sensitive_column_names=sensitive_attrs,
			include_sensitive_columns=False,
			include_intercept_term=True)

	return render_template('gui.html',setup_form=setup_form,
		measure_functions_dict=measure_functions_dict,
		math_operators=math_operators,
		math_functions=math_functions)


@main.route("/process_constraints",methods=["GET","POST"]) 
def process_constraints(): 
	print("Inside process_constraints()")
	# Validate constraint

	constraints = request.json['constraintsData']
	form_data = request.json['formData']
	# constraints = request.json['constraintsData']
	print("The constraint strings are: ")
	print(constraints)

	regime_dict = form_data[0]
	regime = regime_dict['value']
	if regime == 'supervised':
		sub_regime_dict = form_data[1]
		sub_regime = sub_regime_dict['value']
		sensitive_attributes_dict = form_data[2]
		sensitive_attributes = sensitive_attributes_dict['value']
		print(regime,sub_regime,sensitive_attributes)
	elif regime == 'RL':
		sub_regime = "all"
		sensitive_attributes = []
	# columns = ["M","F"]
	parse_trees = []
	for constraint_str in constraints:
		pt = ParseTree(delta=0.05,regime=regime,
			sub_regime=sub_regime,columns=sensitive_attributes)
		try:
			pt.create_from_ast(constraint_str)
		except Exception as e:
			print(e)
			return jsonify(success=0,
				error_msg=("Issue building the parse tree for constraint: "
						  f"{constraint_str}"))

	return jsonify(success=1)

