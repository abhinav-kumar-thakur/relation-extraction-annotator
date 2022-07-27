from typing import Dict

from bson import ObjectId

from db.db import db


# Upload raw data to db
def upload_raw_data(raw_data: Dict):
    for data in raw_data:
        if 'status' not in data:
            data['status'] = 'pending'

    db.data.delete_many({})
    db.data.insert_many(raw_data)


# Get next raw data from db
def get_next_raw_data(state: str, offset: int):
    """
    Returns the next raw data from the database.
    """

    if state == 'all':
        data = db.data.find().sort('_id').skip(offset).limit(1);
    else:
        data = db.data.find({'status': state}).sort('_id').skip(offset).limit(1);

    data = list(data)
    if not data:
        return None

    next = data[0]
    next['_id'] = str(next['_id'])
    return next


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
