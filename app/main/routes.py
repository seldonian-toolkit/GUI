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


main = Blueprint('main',__name__)

@main.route("/",methods=["GET"]) 
def home(): 
    return render_template('home.html')

@main.route("/gui",methods=["GET","POST"]) 
def gui(): 
    setup_form = SetupForm()
    
    return render_template('gui.html',setup_form=setup_form,
        measure_functions_dict=measure_functions_dict)

@main.route("/test",methods=["GET","POST"]) 
def test(): 
    
    return render_template('test.html')

