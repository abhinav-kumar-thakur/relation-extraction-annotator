# learning_e2e
Web framework for end to end machine learning

* Run the application in docker: `docker-compose -f docker-compose.dev.yml up -d`
* To bring down the application: `docker-compose -f docker-compose.dev.yml down -v`
* To check docker-compose logs: `docker-compose -f docker-compose.dev.yml logs`

## Local development:
* Use containerized mongo db: `docker-compose -f docker-compose.dev.yml up --build -d database`
* [Setting up backend locally](./backend/README.md)
* [Setting up frontend locally](./frontend/README.md)
