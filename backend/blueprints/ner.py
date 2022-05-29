from email.policy import default
import json

from flask import Blueprint, request, jsonify

from db.ner import upload_ner_types, get_ner_types
from db.ner import upload_raw_data as upload_raw_data_db
from db.ner import get_next_raw_data as get_next_raw_data_db
from db.ner import update_raw_data


ner_bp = Blueprint('ner', __name__)

@ner_bp.route('/types', methods=['GET'])
def get_entity_types():
    """
    Get all entity types
    """
    return jsonify(get_ner_types())

@ner_bp.route('/types/upload', methods=['POST'])
def upload_entity_types():
    """
    Uploads entity types to the database.
    """
    file = request.files['File']
    if not '.json' in file.filename:
        return jsonify({"error": "File must be a JSON file."})
    
    ner_types = json.load(file)
    if not ['entities', 'relations'] == list(ner_types.keys()):
        return jsonify({"error": "File must contain 'entities' and 'relations' keys."})

    upload_ner_types(ner_types)
    return jsonify({'status': 'success'})


@ner_bp.route('/raw/upload', methods=['POST'])
def upload_raw_data():
    """
    Uploads raw data to the database.
    """
    file = request.files['File']
    if not '.json' in file.filename:
        return jsonify({"error": "File must be a JSON file."})
    
    raw_data = json.load(file)

    upload_raw_data_db(raw_data)
    return jsonify({'status': 'success'})


@ner_bp.route('/raw/next', methods=['GET'])
def get_next_raw_data():
    """
    Returns the next raw data from the database.
    """

    return jsonify(get_next_raw_data_db())

@ner_bp.route('/approve', methods=['POST'])
def approve():
    """
    Approves the raw data.
    """
    data = request.get_json()
    _id = data['_id']
    updates = {
        'status': 'approved',
        'entities': data['entities'],
        'relations': data['relations']
    }

    update_raw_data(_id, updates)
    return jsonify({'status': 'success'})
