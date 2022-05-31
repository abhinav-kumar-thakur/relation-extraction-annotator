# Python environment
* Create: `conda create -n learning_e2e python=3.10`
* Conda activate: `conda activate learning_e2e`
* Conda deactivate: `conda deactivate`
* Install Dependencies: `pip install -r requirements.txt`

# Run migrations
* Local docker connection string: `mongodb://root:example@localhost:27017/learning_e2e?authSource=admin&readPreference=primary&ssl=false`
* Run migrations: `pymongo-migrate -u <connection_string>`

# Starting development application
Within backend directory run: `FLASK_DEBUG=1 FLASK_ENV=DEVELOPMENT FLASK_APP=app.py flask run`

