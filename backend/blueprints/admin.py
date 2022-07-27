import json

from flask import Blueprint, request, jsonify

from db.admin import get_ner_types, upsert_configs, get_configs

LABELS_KEY = 'labels'
RULES_KEY = 'rules'

admin_bp = Blueprint('ner', __name__)


@admin_bp.route('/labels/upload', methods=['POST'])
def upload_labels():
    file = request.files['File']
    if '.json' not in file.filename:
        return jsonify({"error": "File must be a JSON file."})

    labels = json.load(file)
    if not ['entities', 'relations'] == list(labels.keys()):
        return jsonify({"error": "File must contain 'entities' and 'relations' keys."})

    upsert_configs(LABELS_KEY, labels)
    return jsonify({'status': 'success'})


@admin_bp.route('/labels', methods=['GET'])
def get_labels():
    labels = get_configs(LABELS_KEY)
    entities = list(labels['entities'].keys())
    relations = list(labels['relations'].keys())
    return jsonify({'entities': entities, 'relations': relations})


@admin_bp.route('/rules/upload', methods=['POST'])
def upload_rules():
    file = request.files['File']
    if '.json' not in file.filename:
        return jsonify({"error": "File must be a JSON file."})

    rules = json.load(file)
    if not ['default', 'rules'] == list(rules.keys()):
        return jsonify({"error": "File must contain 'default' and 'rules' keys."})

    upsert_configs(RULES_KEY, rules)
    return jsonify({'status': 'success'})


@admin_bp.route('/rules', methods=['Get'])
def get_rules():
    rules = get_configs(RULES_KEY)
    del rules['_id']
    return jsonify(rules)
