from flask import (render_template, request, redirect, Blueprint,
                   session, url_for, flash, Markup,Request,
                   jsonify,current_app,send_from_directory)
from werkzeug.utils import secure_filename
from .forms import SetupForm
from .utils import allowed_file
import numpy as np
import os

from seldonian.parse_tree.operators import measure_functions_dict
# from seldonian.io_utils import load_json
math_operators = ['+','-','*','/']
math_functions = ['min','max','abs','exp']

str_to_remove = '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">'

main = Blueprint('main',__name__)

@main.route("/",methods=["GET"]) 
def home(): 
    return render_template('home.html')

@main.route("/gui",methods=["GET","POST"]) 
def gui(): 
    setup_form = SetupForm()
    return render_template('gui.html',setup_form=setup_form,
        measure_functions_dict=measure_functions_dict,
        math_operators=math_operators,
        math_functions=math_functions)

@main.route("/process_constraints",methods=["GET","POST"]) 
def process_constraints(): 
    print("Inside process_constraints()")
    constraint_str = request.json['data']
    constraint_str = constraint_str.replace(str_to_remove,"")
    print("The constraint is: ")
    print(constraint_str)

    # data = request.json['data']
    # print(data)
    # print(divinfo)
    return url_for("main.gui")
    # return jsonify(title="test", article="article")

@main.route("/test",methods=["GET","POST"]) 
def test(): 
    
    return render_template('test.html')

