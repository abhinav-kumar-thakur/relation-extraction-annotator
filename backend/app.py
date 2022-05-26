from flask import Flask
from blueprints.ner import ner_bp


app = Flask(__name__)
app.register_blueprint(ner_bp, url_prefix='/ner')

