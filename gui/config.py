# config.py
""" This file contains the setup for the app,
for both testing and deployment """

import os
from datetime import timedelta

# The default config
class Config(object):
	SECRET_KEY = os.urandom(24)
	UPLOAD_FOLDER = "app/static/uploads"
	ALLOWED_EXTENSIONS = {'csv','txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


class TestConfig(Config):
	DEBUG = True
	WTF_CSRF_ENABLED = False

