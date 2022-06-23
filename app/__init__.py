import os,sys
from flask import Flask
import werkzeug
from app.config import Config
from flask_wtf.csrf import CSRFProtect


def create_app(config_class=Config):
	""" Create the flask app instance"""
	app = Flask(__name__)
	csrf = CSRFProtect()
	csrf.init_app(app)
	app.config.from_object(config_class)
	from app.main.routes import main
	app.register_blueprint(main)

	@app.errorhandler(werkzeug.exceptions.BadRequest)
	def handle_bad_request(e):
	    return "Issue building the parse tree", 401

	return app
