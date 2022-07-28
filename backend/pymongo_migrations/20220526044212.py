from pymongo.database import Database
"""
Migration description here!
"""
name = '20220526044212'
dependencies = []


def upgrade(db: Database):
    db.create_collection('admin')
    db.create_collection('data')


def downgrade(db: Database):
    db.drop_collection('admin')
    db.drop_collection('data')
