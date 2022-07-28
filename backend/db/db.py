from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = PyMongo(current_app).db

    return db


db = LocalProxy(get_db)
