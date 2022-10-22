from html import entities
from typing import Dict

from bson import ObjectId

from db.db import db
from db.admin import get_configs, RULES_KEY
from models.rule import Rules


def upload_data(raw_data: Dict):
    rules_config = get_configs(RULES_KEY)
    rules = Rules(rules_config)

    for data in raw_data:
        data_valid = True
        entities = data['entities']
        for relation in data['relations']:
            head_type, tail_type = entities[relation['head']]['type'], entities[relation['tail']]['type']
            if not rules.is_valid_triple(head_type, tail_type, relation['type']):
                data_valid = False
                relation['invalid'] = True

        if not data_valid:
            data['status'] = 'invalid'

        if 'status' not in data:
            data['status'] = 'pending'

    db.data.delete_many({})
    db.data.insert_many(raw_data)


def get_next_raw_data(query):
    """
    Returns the next raw data from the database.
    """
    labelFilterLen = len(query['labelValues'])
    if query['state'] == 'all' and  labelFilterLen == 0:
        data = db.data.find().sort('_id').skip(query['offset']).limit(1);
    elif labelFilterLen > 0 and query['state'] == "all":
        if query['labelType'] == 'entities':
            data = db.data.find({'entities.type': {'$in': query['labelValues']}}).sort('_id').skip(query['offset']).limit(1);
        elif query['labelType'] == 'relations':
            data = db.data.find({'relations.type': {'$in': query['labelValues']}}).sort('_id').skip(query['offset']).limit(1);
    elif labelFilterLen > 0 and query['state'] != "all":
        if query['labelType'] == 'entities':
            data = db.data.find({'status': query['state'], 'entities.type': {'$in': query['labelValues']}}).sort('_id').skip(query['offset']).limit(1);
        elif query['labelType'] == 'relations':
            data = db.data.find({'status': query['state'], 'relations.type': {'$in': query['labelValues']}}).sort('_id').skip(query['offset']).limit(1);
    else:
        data = db.data.find({'status': query['state']}).sort('_id').skip(query['offset']).limit(1);

    data = list(data)
    if not data:
        return None

    data = data[0]
    data['_id'] = str(data['_id'])
    return data


# Update raw data in db
def update_raw_data(raw_data_id: str, data: Dict):
    result = db.data.update_one(
        {'_id': ObjectId(raw_data_id)},
        {'$set': data}
    )

    return int(result.raw_result['nModified']) == 1


# Get all approved raw data
def get_all_approved_raw_data():
    raw_data = db.data.find({'status': 'approved'})
    raw_data = list(raw_data)
    for data in raw_data:
        del data['_id']

    return raw_data


# Get all approved raw data
def get_all_data():
    raw_data = db.data.find()
    raw_data = list(raw_data)
    for data in raw_data:
        del data['_id']

    return raw_data


# Get progress
def get_progress_db():
    counts = list(db.data.aggregate([{"$group": {"_id": "$status", "count": {"$sum": 1}}}]))

    total = 0
    progress = {}
    for status_count in counts:
        count = status_count['count']
        total += count
        progress[status_count['_id']] = count

    progress['total'] = total
    return progress
