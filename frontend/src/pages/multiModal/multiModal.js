import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Modal } from "react-bootstrap";
import { BackendMultiModalURL } from '../../configs/urls';
import './multiModal.css'


function PredictionColumn(props) {
    const predictions = props.predictions;
    const model_name = props.model_name;
    if (predictions === undefined) {
        return null;
    }

    // return colour based on prediction scores
    function getColour(score) {
        if (score < 0.2) {
            return "#F8F8F8";
        } else if (score < 0.5) {
            return "#DCDCDC";
        } else if (score < 0.8) {
            return "#C0C0C0";
        } else {
            return "#A0A0A0";
        }
    }

    return (
        <Col>
            <Row style={{ border: "1px solid black", backgroundColor: "Yellow" }}>
                <h5>{model_name} model</h5>
            </Row>
            <Row style={{ border: "1px solid black", backgroundColor: "orange" }}>
                Predictions
            </Row>
            {
                Object.keys(predictions).map(t => {
                    return (
                        <Row style={{ border: "1px solid black", backgroundColor: getColour(predictions[t]) }}>
                            {t.substring(0, 3)}: {predictions[t].toFixed(2)}
                        </Row>
                    )
                })
            }
        </Col>
    );
};

export default function MultiModal() {
    const [allowZoomOnImage, setAllowZoomOnImage] = useState(false);
    const [imageInfo, setImageInfo] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState(true);

    function getNewSample() {
        fetch(`${BackendMultiModalURL}/info/random`, { method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setImageInfo(result);
            });
    }

    useEffect(() => getNewSample(), []);

    if (!imageInfo) {
        return null;
    }

    return (
        <Container fluid>
            <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Adult Content Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This page contains internet memes that can be misogynous and suitable for users above the age of 18 only. The content on this page is for research purposes only and shouldn't be used otherwise.</p>
                    {/* <p>This page is maintained by Abhinav Kumar Thakur, please provide feedback/suggestions by sending mail at <a href="mailto:akthakur@usc.edu">akthakur@usc.edu</a></p> */}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => setShowWarningModal(false)}>I am 18+</button>
                </Modal.Footer>
            </Modal>
            <span>
                <button onClick={() => getNewSample()}> {'Fetch Random'} </button>
                <button onClick={() => setAllowZoomOnImage(!allowZoomOnImage)}> {allowZoomOnImage ? 'Disable Zoom' : 'Enable Zoom'} </button>
            </span>

            <Row style={{ border: "5px solid black", backgroundColor: `${imageInfo.labels ? "#C3908F" : "#AFE1AF"}` }}>
                <Col sm={4}>
                    <Row >
                        <h3>Test Image</h3>
                        <Image className='Original-Image' src={`${BackendMultiModalURL}/image/${imageInfo.image}`} />
                    </Row>
                    <Row>Ground Truth Labels: {imageInfo.labels}</Row>
                </Col>
                <Col sm={8}>
                    <Row fluid>
                        <h3>Example-Based Model Explanation: </h3>
                    </Row>
                    {
                        Object.keys(imageInfo.similarities).map((model, index) =>
                            <Row>
                                <Col>
                                    {
                                        <PredictionColumn predictions={imageInfo.predictions[model]} model_name={model} />
                                    }
                                </Col>
                                {
                                    imageInfo.similarities[model].map(similarImage => {
                                        return <Col style={{ border: "1px solid black", backgroundColor: `${similarImage.labels ? "#C3908F" : "#AFE1AF"}` }} >
                                            <Row>
                                                <Image className={allowZoomOnImage ? 'Similar-Image-Zoom': 'Similar-Image'} src={`${BackendMultiModalURL}/image/${similarImage.image}`} />
                                            </Row>
                                            <Row>
                                                Similarity: {similarImage.similarity.toFixed(2)}
                                            </Row>
                                            <Row>
                                                Labels: {similarImage.labels}
                                            </Row>
                                        </Col>
                                    })
                                }
                            </Row>)
                    }
                </Col>
            </Row>
            <Row>
                <p> <b>Stereotype:</b> a stereotype is a fixed, conventional idea or set of characteristics assigned to a woman (Eagly and Mladinic, 1989). A meme can use an image of a woman according to her role in the society (role stereotyping), or according to her personality traits and domestic behaviours (gender stereotyping).</p>
                <p> <b>Objectification:</b> A practice of seeing and/or treating a woman like an object (Szymanski et al., 2011).</p>
                <p> <b>Shaming:</b> The practice of criticising women who violate expectations of behaviour and appearance regarding issues related to gender typology (such as “slut shaming”) or related to physical appearance (such as “body shaming”) (Van Royen et al., 2018). This category focuses on content that seeks to insult and offend women because of some characteristics of their body or personality.</p>
                <p> <b>Violence:</b> A meme that indicates physical and/or a call to violence against women (Andreasen, 2021).</p>
            </Row>
        </Container>
    );
}