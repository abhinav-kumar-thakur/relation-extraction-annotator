from typing import Dict

from werkzeug.local import LocalProxy

from db.db import db


# Upload ner_types to db
def upload_ner_types(ner_types: Dict):
    db.ner_types.delete_many({})
    db.ner_types.insert_one(ner_types)

# Get ner_types from db
def get_ner_types():
    types = db.ner_types.find_one()
    entities = list(types['entities'].keys())
    relations = list(types['relations'].keys())
    return {'entities': entities, 'relations': relations}