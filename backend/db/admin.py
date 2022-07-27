from typing import Dict

from db.db import db

KEY = 'key'


def upsert_configs(config_key: str, configs: Dict):
    configs[KEY] = config_key
    db.admin.find_one_and_replace({KEY: config_key}, configs, upsert=True)


def get_configs(config_key: str):
    return db.admin.find_one({KEY: config_key})


def get_ner_types():
    entities = list(types['entities'].keys())
    relations = list(types['relations'].keys())
    return {'entities': entities, 'relations': relations}
