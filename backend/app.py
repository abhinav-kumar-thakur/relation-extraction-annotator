from flask import Flask
from blueprints.ner import ner_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://root:example@localhost:27017/learning_e2e?authSource=admin&readPreference=primary&ssl=false'
app.register_blueprint(ner_bp, url_prefix='/ner')

