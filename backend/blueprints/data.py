import http
import json

from flask import Blueprint, Response, request, jsonify

from db.data import upload_data as upload_raw_data_db
from db.data import get_next_raw_data as get_next_raw_data_db
from db.data import update_raw_data, get_all_approved_raw_data, get_all_data
from db.data import get_progress_db

data_bp = Blueprint('data', __name__)


@data_bp.route('/upload', methods=['POST'])
def upload_raw_data():
    file = request.files['File']
    if '.json' not in file.filename:
        return jsonify({"error": "File must be a JSON file."})

    raw_data = json.load(file)

    upload_raw_data_db(raw_data)
    return jsonify({'status': 'success'})


@data_bp.route('/data/<string:state>/<int:offset>', methods=['GET'])
def get_next_raw_data(state: str, offset: int):
    data = jsonify(get_next_raw_data_db(state, offset))

    if not data:
        return '', http.HTTPStatus.NO_CONTENT

    return data, http.HTTPStatus.OK


@data_bp.route('/update/state/<string:state>', methods=['POST'])
def update_state(state):
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


@data_bp.route('/approved/download', methods=['GET'])
def download_approved_data():
    data = get_all_approved_raw_data()

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Content-Disposition': 'attachment;filename=approved_data.json'
        }
    )


@data_bp.route('/download', methods=['GET'])
def download_all_data():
    data = get_all_data()

    return Response(
        json.dumps(data),
        mimetype='application/json',
        headers={
            'Content-Disposition': 'attachment;filename=all_data.json'
        }
    )


@data_bp.route('/progress', methods=['GET'])
def get_progress():
    return jsonify(get_progress_db())
