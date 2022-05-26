from pymongo.database import Database
"""
Migration description here!
"""
name = '20220526044212'
dependencies = []


def upgrade(db: Database):
    db.create_collection('ner_types')


def downgrade(db: Database):
    db.drop_collection('ner_types')
