from typing import Dict

from db.db import db

KEY = 'key'
RULES_KEY = 'rules'
LABELS_KEY = 'labels'


def upsert_configs(config_key: str, configs: Dict):
    configs[KEY] = config_key
    db.admin.find_one_and_replace({KEY: config_key}, configs, upsert=True)


def get_configs(config_key: str) -> Dict:
    return db.admin.find_one({KEY: config_key})
