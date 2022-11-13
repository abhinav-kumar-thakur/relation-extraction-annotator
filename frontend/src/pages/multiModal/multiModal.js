import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from "react-bootstrap";
import { BackendMultiModalURL } from '../../configs/urls';
import './multiModal.css'

function PredictionTable(props) {
    const predictions = props.predictions;
    if (predictions === undefined) {
        return null;
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
                                        <Row style={{ border: "1px solid black", backgroundColor: `${predictions[key][t] > 0.5 ? "#C3908F" : "#AFE1AF"}` }} xs='auto'>
                                            {t}: {predictions[key][t].toFixed(3)}
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

    useEffect(() => {
        fetch(`${BackendMultiModalURL}/info/random`, { method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setImageInfo(result);
            });
    }, []);

    if (!imageInfo) {
        return null;
    }

    return (
        <Container fluid>
            <span>
                <button onClick={() => setShowLabels(!showLabels)}> {showLabels ? 'Hide Labels' : 'Show Labels'} </button>
                <button onClick={() => setShowDetectedObjects(!showDetectedObjects)}> {showDetectedObjects ? 'Hide Detected Objects' : 'Show Detected Objects'} </button>
                <button onClick={() => setshowSimilar(!showSimilar)}> {showSimilar ? 'Hide Similars' : 'Show Similars'} </button>
            </span>
            {
                showLabels ? <Row>
                    <PredictionTable predictions={imageInfo.predictions} />
                </Row> : null

            }

            <Row style={{ border: "5px solid black", backgroundColor: `${imageInfo.labels ? "#C3908F" : "#AFE1AF"}` }} xs='auto'>
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
                                <p>Labels: {imageInfo.labels}</p>
                                <p>misogynous: {imageInfo.misogynous}</p>
                                <p>shaming: {imageInfo.shaming}</p>
                                <p>stereotype: {imageInfo.stereotype}</p>
                                <p>objectification: {imageInfo.objectification}</p>
                                <p>violence: {imageInfo.violence}</p>
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
        </Container>
    );
}