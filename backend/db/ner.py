from typing import Dict

from bson import ObjectId

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

# Upload raw data to db
def upload_raw_data(raw_data: Dict):
    for data in raw_data:
        data['status'] = 'pending'
    
    db.raw_data.delete_many({})
    db.raw_data.insert_many(raw_data)

# Get next raw data from db
def get_next_raw_data():
    """
    Returns the next raw data from the database.
    """

    next = db.raw_data.find_one_and_update(
        {'status': 'pending'},
        {'$set': {'status': 'processing'}}
    )
    
    next['_id'] = str(next['_id'])
    return next

# Update raw data in db
def update_raw_data(raw_data_id: str, data: Dict):
    db.raw_data.update_one(
        {'_id': ObjectId(raw_data_id)},
        {'$set': data}
    )