# Backend

## Development Requirements
1. Conda: https://github.com/conda-forge/miniforge.git
2. Python 3.10: conda create -n learning_e2e python=3.10

## Python environment
* Create: `conda create -n learning_e2e python=3.10`
* Conda activate: `conda activate learning_e2e`
* Conda deactivate: `conda deactivate`
* Install Dependencies: `pip install -r requirements.txt`

### Run migrations
* Docker connection string: `mongodb://root:example@localhost:27017/learning_e2e?authSource=admin&readPreference=primary&ssl=false`
* Migration command: `pymongo-migrate migrate -u <connection_string>`
* Use: `pymongo-migrate migrate  -u "mongodb://root:example@localhost:27017/learning_e2e?authSource=admin&readPreference=primary&ssl=false"`

## Starting development application
Run: `MONGO_URI="mongodb://root:example@localhost:27017/learning_e2e?authSource=admin&readPreference=primary&ssl=false" FLASK_DEBUG=1 FLASK_ENV=DEVELOPMENT FLASK_APP=app.py flask run -p 12000`
