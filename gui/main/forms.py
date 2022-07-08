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

# class TagListField(Field):
# 	widget = TextInput()

# 	def _value(self):
# 		if self.data:
# 			return u', '.join(self.data)
# 		else:
# 			return u''

# 	def process_formdata(self, valuelist):
# 		if valuelist:
# 			self.data = [x.strip() for x in valuelist[0].split(',')]
# 		else:
# 			self.data = []

# class ConstraintForm(FlaskForm):
# 	""" The form for a single constraint """
# 	# base_nodes = FieldList(FormField(BaseNodeForm),min_entries=1,max_entries=10)
# 	# constant_nodes = FieldList(FormField(ConstantNodeForm),min_entries=1,max_entries=10)
# 	# operator_nodes = FieldList(FormField(OperatorNodeForm),min_entries=1,max_entries=10)
# 	# used_target_boxes = FieldList(FormField())
# 	# constraint_str = StringField('Type your constraint:',validators=[InputRequired()])

class SetupForm(FlaskForm):
	""" The top level form """
	data_file = FileField('Data file:')
	
	regime = SelectField('Regime:', 
		choices=[('supervised','supervised'),('RL','RL')],
				 validators=[InputRequired()])

	sub_regime = SelectField('Sub-regime:', 
		choices=[('classification','classification'),('regression','regression')],
				 validators=[InputRequired()])
	
	all_attributes = StringField('All attributes (comma separated)')
	
	sensitive_attributes = StringField('Sensitive attributes (comma separated):', 
				 validators=[])
	
	label_column = StringField('Label column')
	# taglist = TagListField("Tag list here",render_kw={'disabled':''})
	# taglist = TagListField("Tag list here")
	# constraint_forms = FieldList(FormField(ConstraintForm),min_entries=1,max_entries=10)

	submit = SubmitField('Submit',id="submit_btn")


# class BaseNodeForm(FlaskForm):
# 	""" The form for a single base node """

	
