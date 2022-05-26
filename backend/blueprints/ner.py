from flask import Blueprint, request, jsonify


ner_bp = Blueprint('ner', __name__)

@ner_bp.route('/entitytypes', methods=['GET'])
def get_entity_types():
    """
    Get all entity types
    """
    return jsonify({'entity_types': ['person', 'location', 'organization', 'date']})
