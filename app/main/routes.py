from flask import (render_template, request, redirect, abort, Blueprint,
				   session, url_for, flash,
				   jsonify,current_app,send_from_directory)
from werkzeug.utils import secure_filename
from .forms import SetupForm
from .utils import allowed_file
import numpy as np
import os

from seldonian.parse_tree.operators import measure_functions_dict
from seldonian.parse_tree.parse_tree import ParseTree
# from seldonian.io_utils import load_json

math_operators = ['+','-','*','/']
math_functions = ['min()','max()','abs()','exp()']

main = Blueprint('main',__name__)

@main.route("/",methods=["GET"]) 
def home(): 
	return render_template('home.html')

@main.route("/gui",methods=["GET","POST"]) 
def gui(): 
	setup_form = SetupForm()
	setup_form.sensitive_attributes.data = "M,F"
	if request.method == 'POST':
		print(request.form)

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

@main.route("/test",methods=["GET","POST"]) 
def test(): 
	
	return render_template('test.html')

