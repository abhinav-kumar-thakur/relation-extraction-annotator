# learning_e2e
Web framework for end to end machine learning. Currently only NER data labeling is supported.

* To run with last stable release: `git checkout v0.1.5`
* Run the application in docker: `docker-compose -f docker-compose.dev.yml up -d`
* To bring down the application: `docker-compose -f docker-compose.dev.yml down -v`
* To check docker-compose logs: `docker-compose -f docker-compose.dev.yml logs`

Application will become available on [http://localhost:11001/](http://localhost:11001/).

## Local development:
* Use containerized mongo db: `docker-compose -f docker-compose.dev.yml up --build -d database`
* [Setting up backend locally](./backend/README.md)
* [Setting up frontend locally](./frontend/README.md)

## NER labeling tool

### NER labeling UI Demo
![image](https://user-images.githubusercontent.com/14326083/179493581-ec518f10-5a5d-4174-9d92-43117e8fc5d6.png)

Once the application is running, follow following steps to start NER labeling.
1. One time / First time: Upload the types and data files manually. Upload of new types/data file completely removes previously stored values.

**Types file format**
```json
{
    "entities": {
        "E1_name": {
            "short": "E1_short",
            "verbose": "E1_verbose"
        },
        "E2_name": {
            "short": "E2_short",
            "verbose": "E2_verbose"
        }
    },
    "relations": {
        "R1_name": {
            "short": "R1_short",
            "verbose": "R1_verbose",
            "symmetric": false
        },
        "R2_name": {
            "short": "R2_short",
            "verbose": "R2_verbose",
            "symmetric": false
        }
    }
}

```

**Data file format**
```json
[
    {
        "tokens": [ "A_of_type_E1", "has", "relation_R1", "with", "B_of_type_E2", "."],
        "entities": [
            {
                "type": "E1_name",
                "start": 0,
                "end": 1,
                "score": "Holds entity prediction score object."
            },
            {
                "type": "E2_name",
                "start": 4,
                "end": 5,
                "score": "Holds entity prediction score object."
            }
        ],
        "relations": [
            {
                "type": "R1_name",
                "head": 0,
                "tail": 1,
                "score": "Holds relation prediction score object."
            }
        ]
    }
]
```

*Don't deploy in production with development credentials added in docker-compose.dev.yml*
