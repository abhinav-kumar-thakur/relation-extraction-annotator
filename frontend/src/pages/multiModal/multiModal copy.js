import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Modal } from "react-bootstrap";
import { BackendMultiModalURL } from '../../configs/urls';
import './multiModal.css'

function PredictionTable(props) {
    const predictions = props.predictions;
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
        <Row fluid>
            {
                Object.keys(predictions).map(key => {
                    return (
                        <Col>
                            <Row style={{ border: "1px solid black", backgroundColor: "orange" }} xs='auto'>
                                {key}
                            </Row>
                            {
                                Object.keys(predictions[key]).map(t => {
                                    return (
                                        <Row style={{ border: "1px solid black", backgroundColor: getColour(predictions[key][t])}} xs='auto'>
                                            {t.substring(0, 2)}: {predictions[key][t].toFixed(2)}
                                        </Row>
                                    )
                                })
                            }
                        </Col>
                    );
                })
            }
        </Row>
    );
};

export default function MultiModal() {
    const [imageInfo, setImageInfo] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [showDetectedObjects, setShowDetectedObjects] = useState(false);
    const [showSimilar, setshowSimilar] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(true);

    function getNewSample() {
        fetch(`${BackendMultiModalURL}/info/random`, { method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setImageInfo(result);
            });
    }

    useEffect(() => getNewSample() , []);

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
                <button onClick={() => setShowLabels(!showLabels)}> {showLabels ? 'Hide Labels' : 'Show Labels'} </button>
                <button onClick={() => setShowDetectedObjects(!showDetectedObjects)}> {showDetectedObjects ? 'Hide Detected Objects' : 'Show Detected Objects'} </button>
                <button onClick={() => setshowSimilar(!showSimilar)}> {showSimilar ? 'Hide Similars' : 'Show Similars'} </button>
                <button onClick={() => getNewSample()}> {'Fetch Random'} </button>
            </span>
            {
                showLabels ? <Row>
                    <PredictionTable predictions={imageInfo.predictions} />
                </Row> : null

            }

            <Row style={{ border: "5px solid black", backgroundColor: `${imageInfo.labels && showLabels ? "#C3908F" : "#AFE1AF"}` }} xs='auto'>
                <Col>
                    <Row>
                        <Col>
                            <div >
                                <h3>Original Image</h3>
                                <Image className='Original-Image' src={`${BackendMultiModalURL}/image/${imageInfo.image}`} />
                            </div>
                        </Col>
                        {showLabels ?
                            <Col>
                                <p>Ground Truth Labels: {imageInfo.labels}</p>
                                <p>misogynous (Ratio of neighbors): {imageInfo.misogynous}</p>
                                <p>shaming (Ratio of neighbors): {imageInfo.shaming}</p>
                                <p>stereotype (Ratio of neighbors): {imageInfo.stereotype}</p>
                                <p>objectification (Ratio of neighbors): {imageInfo.objectification}</p>
                                <p>violence (Ratio of neighbors): {imageInfo.violence}</p>
                            </Col> : null
                        }
                    </Row>
                </Col>
                {

                    showDetectedObjects ? imageInfo.objects.map(obj => {
                        return <Col>
                            <Row>
                                <Image className='Original-Image' src={`${BackendMultiModalURL}/objects/${obj.filename}`} />
                            </Row>
                            <Row>
                                <Col>
                                    confidence: {obj.confidence.toFixed(2)}
                                </Col>
                                <Col>
                                    label: {obj.label}
                                </Col>
                            </Row>
                        </Col>
                    }) : null
                }
            </Row>
            <Row fluid>
                <h3>Similar Memes: {showSimilar ? "" : "Hidden"}</h3>
            </Row>
            {
                showSimilar ? imageInfo.similarities.map(similarImage => {
                    return <Row style={{ border: "5px solid blue", backgroundColor: `${similarImage.labels ? "#C3908F" : "#AFE1AF"}` }} xs='auto'>
                        <Col>
                            <Row>
                                <Image className='Original-Image' src={`${BackendMultiModalURL}/image/${similarImage.image}`} />
                            </Row>
                        </Col>
                        {
                            showLabels ? <Col>
                                <Row>
                                    Similarity: {similarImage.similarity.toFixed(2)}
                                </Row>
                                <Row>
                                    Labels: {similarImage.labels}
                                </Row>
                            </Col> : null
                        }
                        {
                            showDetectedObjects ? similarImage.objects.map(obj => {
                                return <Col>
                                    <Row>
                                        <Image className='Original-Image' src={`${BackendMultiModalURL}/objects/${obj.filename}`} />
                                    </Row>
                                    <Row>
                                        <Col>
                                            confidence: {obj.confidence.toFixed(2)}
                                        </Col>
                                        <Col>
                                            label: {obj.label}
                                        </Col>
                                    </Row>
                                </Col>
                            }) : null
                        }
                    </Row>
                }) : null
            }
            {/* <Row><p><b>Meme Category:</b> In Development</p> </Row>
            <Row><p><b>Text Entities:</b> Meme, I </p></Row> */}
            <Row>
                <p> <b>Stereotype:</b> a stereotype is a fixed, conventional idea or set of characteristics assigned to a woman (Eagly and Mladinic, 1989). A meme can use an image of a woman according to her role in the society (role stereotyping), or according to her personality traits and domestic behaviours (gender stereotyping).</p>
                <p> <b>Objectification:</b> A practice of seeing and/or treating a woman like an object (Szymanski et al., 2011).</p>
                <p> <b>Shaming:</b> The practice of criticising women who violate expectations of behaviour and appearance regarding issues related to gender typology (such as “slut shaming”) or related to physical appearance (such as “body shaming”) (Van Royen et al., 2018). This category focuses on content that seeks to insult and offend women because of some characteristics of their body or personality.</p>
                <p> <b>Violence:</b> A meme that indicates physical and/or a call to violence against women (Andreasen, 2021).</p>
            </Row>
        </Container>
    );
}