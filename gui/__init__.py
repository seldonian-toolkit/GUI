import os,sys
from flask import Flask
import werkzeug
from gui.config import Config
from flask_wtf.csrf import CSRFProtect


def create_app(config_class=Config):
	""" Create the flask app instance"""
	# if getattr(sys, 'frozen', False):
	# 	base_dir = os.path.join(sys._MEIPASS)
	# 	template_folder = os.path.join(base_dir, 'templates')
	# 	static_folder = os.path.join(base_dir, 'static')
	# 	app = Flask(__name__, template_folder=template_folder,
	# 		static_folder=static_folder)
	# else:
	app = Flask(__name__)
	# app = Flask(__name__)
	csrf = CSRFProtect()
	csrf.init_app(app)
	app.config.from_object(config_class)
	from gui.main.routes import main
	app.register_blueprint(main)

	# @app.errorhandler(werkzeug.exceptions.BadRequest)
	# def handle_bad_request(e):
	# 	return "Issue building the parse tree", 401

	return app
