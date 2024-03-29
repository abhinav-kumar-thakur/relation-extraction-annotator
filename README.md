# relation-extraction-annotator
Web framework for end to end machine learning. Currently only NER and RE data labeling is supported.

* To run with last stable release: `git checkout v0.1.6`
* Run the application in docker: `docker-compose -f docker-compose.dev.yml up -d`
* To bring down the application: `docker-compose -f docker-compose.dev.yml down -v`
* To check docker-compose logs: `docker-compose -f docker-compose.dev.yml logs`

Application will become available on [http://localhost:11001/](http://localhost:11001/).

## Setting up tool with the sample files
* To download sample data run: `sh ./scripts/download_data.sh` which should download Relation extraction datasets in sample_files directory
* On the Upload tab of Admin page upload:
    - Types file: `sample_files/datasets/conll04/conll04_types.json`
    - Rules file: `sample_files/rules.json`
    - Data file: `sample_files/datasets/conll04/conll04_train.json`


## Local development:
* Use containerized mongo db: `docker-compose -f docker-compose.dev.yml up --build -d database`
* [Setting up backend locally](./backend/README.md)
* [Setting up frontend locally](./frontend/README.md)

## NER labeling tool

### NER labeling UI Demo
#### Admin Page (Upload)
![image](https://user-images.githubusercontent.com/14326083/221099363-182d6e8e-d419-4ae0-a828-7f27aec9b82d.png)
#### Admin Page (Download)
![image](https://user-images.githubusercontent.com/14326083/221099456-6b2f0136-628c-42ff-89ec-a18b0a9f2d16.png)
#### Relation Extraction: Labeling Page
![image](https://user-images.githubusercontent.com/14326083/221099603-4728e623-585d-4b91-bfa4-5182d1ac0e6a.png)

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
