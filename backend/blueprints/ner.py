import json

from flask import Blueprint, request, jsonify

from db.ner import upload_ner_types, get_ner_types


ner_bp = Blueprint('ner', __name__)

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

@ner_bp.route('/types', methods=['GET'])
def get_entity_types():
    """
    Get all entity types
    """
    return jsonify(get_ner_types())
