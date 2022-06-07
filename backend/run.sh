#!/bin/sh
set -euo pipefail
IFS=$'\n\t'

pip install -r requirements.txt
pymongo-migrate migrate -u $DB_HOST -m pymongo_migrations
flask run -p 11000 -h 0.0.0.0
