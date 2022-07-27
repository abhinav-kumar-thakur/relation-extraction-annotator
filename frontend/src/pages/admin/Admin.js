import React, {useState} from 'react';
import {Col, Row, Container, Stack, Tab, Tabs, InputGroup} from "react-bootstrap";

export function Admin() {
    const backend_url = 'api/ner';

    // NER Types file states
    const [selectedEntityTypesFile, setSelectedEntityTypesFile] = useState();
    const [isEntityTypesFileSelected, setIsEntityTypesFileSelected] = useState(false);
    const [uploadEntityButtonText, setUploadEntityButtonText] = useState('Upload');

    // data file states
    const [selectedDataFile, setSelectedDataFile] = useState();
    const [isDataFileSelected, setIsDataFileSelected] = useState(false);
    const [uploadDataFileButtonText, setUploadDataFileButtonText] = useState('Upload');

    const entityTypesFileChangeHandler = (event) => {
        setSelectedEntityTypesFile(event.target.files[0]);
        setUploadEntityButtonText('Upload');
        setIsEntityTypesFileSelected(true);
    };

    const handleNERFileSubmission = () => {
        const formData = new FormData();
        formData.append('File', selectedEntityTypesFile);
        fetch(backend_url + '/types/upload', {method: 'POST', body: formData})
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setUploadEntityButtonText('Uploaded');
            })
            .catch((error) => {
                console.error('Error:', error);
                setUploadEntityButtonText('Failed');
            });
    };

    const handleDataFileSubmission = () => {
        const formData = new FormData();
        formData.append('File', selectedDataFile);
        fetch(backend_url + '/raw/upload', {method: 'POST', body: formData})
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setUploadDataFileButtonText('Uploaded');
            })
            .catch((error) => {
                console.error('Error:', error);
                setUploadDataFileButtonText('Failed');
            });
    };

    const dataFileChangeHandler = (event) => {
        setSelectedDataFile(event.target.files[0]);
        setUploadDataFileButtonText('Upload');
        setIsDataFileSelected(true);
    };

    return (<Tabs
        defaultActiveKey="uploads"
        id="uncontrolled-tab-example"
        className="mb-3"
    >
        <Tab eventKey="uploads" title="Uploads">
            <div>
                <Container>
                    <Row>
                        <h4>Types file</h4>
                        <InputGroup className="mb-3">

                            <input type="file" onChange={entityTypesFileChangeHandler}/>
                            <button onClick={handleNERFileSubmission}
                                    disabled={!isEntityTypesFileSelected}>{uploadEntityButtonText}</button>
                        </InputGroup>
                    </Row>
                    <Row>
                        <h4>Data file</h4>
                        <InputGroup className="mb-3">

                            <input type="file" onChange={dataFileChangeHandler}/>
                            <button onClick={handleDataFileSubmission}
                                    disabled={!isDataFileSelected}>{uploadDataFileButtonText}</button>
                        </InputGroup>
                    </Row>
                </Container>
            </div>
        </Tab>
        <Tab eventKey="downloads" title="Downloads">
            <Container>
                <Row>
                    <a href={backend_url + '/all/download'}>All</a>
                </Row>
                <Row>
                    <a href={backend_url + '/approved/download'} style={{'marginRight': '1%'}}>Approved</a>
                </Row>
            </Container>
        </Tab>
    </Tabs>);
}