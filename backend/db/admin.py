from typing import Dict

from bson import ObjectId

from db.db import db

KEY = 'key'
LABELS_KEY = 'labels'

# Upload ner_types to db
def upload_ner_types(ner_types: Dict):
    ner_types[KEY] = LABELS_KEY
    db.admin.find_one_and_replace({KEY: LABELS_KEY}, ner_types, upsert=True)
    

# Get ner_types from db
def get_ner_types():
    types = db.admin.find_one({KEY: LABELS_KEY})
    entities = list(types['entities'].keys())
    relations = list(types['relations'].keys())
    return {'entities': entities, 'relations': relations}

