import React from 'react';
import {Container, Row, Tab, Tabs} from "react-bootstrap";
import {FileUploader} from "../../components/fileuploader/FileUploader";
import {
    TypeFileUploadURL,
    DataFileUploadURL,
    DataDownloadURL,
    ApprovedDownloadURL,
    RulesFileUploadURL
} from "../../configs/urls"

export default function Admin() {
    return (<Tabs
        defaultActiveKey="uploads"
        id="uncontrolled-tab-example"
        className="mb-3"
    >
        <Tab eventKey="uploads" title="Uploads">
            <div>
                <Container>
                    <Row>
                        <FileUploader title="Types file" upload_url={TypeFileUploadURL} />
                    </Row>
                    <Row>
                        <FileUploader title="Rules file" upload_url={RulesFileUploadURL} />
                    </Row>
                    <Row>
                        <FileUploader title="Data file" upload_url={DataFileUploadURL} />
                    </Row>
                </Container>
            </div>
        </Tab>
        <Tab eventKey="downloads" title="Downloads">
            <Container>
                <Row>
                    <a href={DataDownloadURL}>All</a>
                </Row>
                <Row>
                    <a href={ApprovedDownloadURL}>Approved</a>
                </Row>
            </Container>
        </Tab>
    </Tabs>);
}
