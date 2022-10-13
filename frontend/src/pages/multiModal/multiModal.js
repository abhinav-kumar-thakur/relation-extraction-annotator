import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from "react-bootstrap";
import { BackendMultiModalURL } from '../../configs/urls';
import './multiModal.css'

export default function MultiModal() {
    const [imageInfo, setImageInfo] = useState(null);
    const [showLabels, setShowLabels] = useState(false);

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
            <Row>
                <button onClick={() => setShowLabels(!showLabels)}> {showLabels ? 'Hide Labels' : 'Show Labels'} </button>
            </Row>
            <Row style={{ border: "1px solid blue" }} xs='auto'>
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
                    imageInfo.objects.map(obj => {
                        return <Col>
                            <Row>
                                <Image className='Original-Image' src={`${BackendMultiModalURL}/objects/${obj.filename}`} />
                            </Row>
                            <Row>
                                confidence: {obj.confidence.toFixed(2)}
                            </Row>
                        </Col>
                    })
                }
            </Row>
            <Row fluid>
                <h3>Similar Memes</h3>
            </Row>
            {
                imageInfo.similarities.map(similarImage => {
                    return <Row style={{ border: "1px solid yellow" }} xs='auto'>
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
                            similarImage.objects.map(obj => {
                                return <Col>
                                    <Row>
                                        <Image className='Original-Image' src={`${BackendMultiModalURL}/objects/${obj.filename}`} />
                                    </Row>
                                    <Row>
                                        confidence: {obj.confidence.toFixed(2)}
                                    </Row>
                                </Col>
                            })}
                    </Row>
                })
            }
            <Row><p><b>Meme Category:</b> Funny</p> </Row>
            <Row><p><b>Text Entities:</b> Meme, I </p></Row>
        </Container>
    );
}