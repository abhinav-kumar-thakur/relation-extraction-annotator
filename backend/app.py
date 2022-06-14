from flask import Flask
from blueprints.ner import ner_bp
from flask_cors import CORS
from os import environ

app = Flask(__name__)

# TODO: Add more specific CORS options
CORS(app, resources={r"/api/ner/*": {"origins": "*"}})

app.config['MONGO_URI'] = environ.get('MONGO_URI')
app.register_blueprint(ner_bp, url_prefix='/api/ner')

@app.route('/status')
def app_status():
    return 'OK'