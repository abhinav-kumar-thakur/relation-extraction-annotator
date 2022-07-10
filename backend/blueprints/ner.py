from email.policy import default
import http
import json

from flask import Blueprint, Response, request, jsonify

from db.ner import upload_ner_types, get_ner_types
from db.ner import upload_raw_data as upload_raw_data_db
from db.ner import get_next_raw_data as get_next_raw_data_db
from db.ner import update_raw_data, get_all_approved_raw_data, get_all_data


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


@ner_bp.route('/raw/next/<string:state>/<int:offset>', methods=['GET'])
def get_next_raw_data(state: str, offset: int):
    """
    Returns the next raw data from the database.
    """

    data = jsonify(get_next_raw_data_db(state, offset))

    if not data:
        return '', http.HTTPStatus.NO_CONTENT

    return data, http.HTTPStatus.OK 

@ner_bp.route('/state/update/<string:state>', methods=['POST'])
def update_state(state):
    """
    Approves the raw data.
    """
    data = request.get_json()
    _id = data['_id']
    print(f'Update state: {state} for {_id}')
    updates = {
        'status': state,
        'entities': data['entities'],
        'relations': data['relations']
    }

    if not update_raw_data(_id, updates):
        return jsonify({'status': 'Failure', 'Error': 'No updates in database'})
    
    return jsonify({'status': 'success'})

@ner_bp.route('/approved/download', methods=['GET'])
def download_approved_data():
    data = get_all_approved_raw_data()
    
    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Content-Disposition': 'attachment;filename=approved_data.json'
        }
    )

@ner_bp.route('/all/download', methods=['GET'])
def download_all_data():
    data = get_all_data()
    
    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Content-Disposition': 'attachment;filename=all_data.json'
        }
    )