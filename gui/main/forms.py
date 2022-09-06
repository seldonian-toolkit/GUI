from flask_wtf import FlaskForm
from wtforms import (StringField, SubmitField, SelectField,
					 FieldList, FormField,
					 SelectMultipleField, FileField)
from wtforms import DateField as OGDateField

from wtforms.fields import Field
from wtforms.validators import (DataRequired, Length,
	InputRequired, ValidationError, Email, Optional)
from wtforms.widgets import TextInput

datetimeformat='%Y-%m-%dT%H:%M' # To get form.field.data to work. Does not work with the default (bug)

class SetupForm(FlaskForm):
	""" Form for the entire GUI. All fields
	that take input are in the metadata/data setup form
	in the GUI. Submit is at the very bottom of the GUI. """
	data_file = FileField('Data file:')
	
	regime = SelectField('Regime:', 
		choices=[
		('supervised_learning','supervised learning'),
		('reinforcement_learning','reinforcement learning')
		],
		 validators=[InputRequired()]
		 )
	sub_regime = SelectField('Sub-regime:', 
		choices=[('classification','classification'),('regression','regression')],
				 validators=[InputRequired()])
	env_module = StringField('Environment module name (e.g. gridworld)')
	env_class = StringField('Environment class name (e.g. Gridworld)')
	agent_module = StringField('Agent module name')
	agent_class = StringField('Agent class name')
	all_attributes = StringField('All attributes (comma separated, no quotes)')
	sensitive_attributes = StringField('Sensitive attributes (comma separated, no quotes):', 
				 validators=[])
	label_column = StringField('Label column')
	submit = SubmitField('Submit',id="submit_btn")

	
