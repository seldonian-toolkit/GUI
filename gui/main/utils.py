from flask import current_app


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def parse_str_commasep(entry_str):
    entry_l = entry_str.split(',')
    return [s.strip("\n").strip() for s in entry_l]