from os import environ

from flask import Flask
from flask_cors import CORS

from blueprints.admin import admin_bp
from blueprints.data import data_bp
from blueprints.multi_modal import multi_modal_bp

app = Flask(__name__)

# TODO: Add more specific CORS options
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['MONGO_URI'] = environ.get('MONGO_URI')
app.register_blueprint(data_bp, url_prefix='/api/data')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(multi_modal_bp, url_prefix='/api/multi-modal')


@app.route('/status')
def app_status():
    return 'OK'
