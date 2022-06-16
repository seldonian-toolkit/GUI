from flask_wtf import FlaskForm
from wtforms import (StringField, SubmitField, TextAreaField, SelectField,
					 BooleanField, HiddenField, IntegerField, FieldList, FormField,
					 SelectMultipleField)
from wtforms import DateField as OGDateField
from wtforms.validators import DataRequired, Length, InputRequired, ValidationError, Email, Optional 
# from wtforms.widgets import html5, CheckboxInput, ListWidget
# from wtforms.fields.html5 import DateField, DateTimeLocalField
# from wtforms.fields.html5 import DateTimeLocalField

datetimeformat='%Y-%m-%dT%H:%M' # To get form.field.data to work. Does not work with the default (bug)

# from lightserv.models import Experiment

class ConstraintForm(FlaskForm):
	""" The form for a single constraint """
	# base_nodes = FieldList(FormField(BaseNodeForm),min_entries=1,max_entries=10)
	# constant_nodes = FieldList(FormField(ConstantNodeForm),min_entries=1,max_entries=10)
	# operator_nodes = FieldList(FormField(OperatorNodeForm),min_entries=1,max_entries=10)
	constraint_str = StringField('Type your constraint:',validators=[InputRequired()])



class SetupForm(FlaskForm):
	""" The top level form """

	regime = SelectField('Regime:', 
		choices=[('supervised','supervised'),('RL','RL')],
				 validators=[InputRequired()])

	sub_regime = SelectField('Sub-regime:', 
		choices=[('classification','classification'),('regression','regression')],
				 validators=[InputRequired()])

	sensitive_attributes = StringField('Sensitive attributes (comma separated):', 
				 validators=[])

	constraint_forms = FieldList(FormField(ConstraintForm),min_entries=1,max_entries=10)

	submit = SubmitField('Submit',id="submit_btn")


# class BaseNodeForm(FlaskForm):
# 	""" The form for a single base node """

	
