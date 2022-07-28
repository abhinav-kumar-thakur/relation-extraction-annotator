import React, {useState} from "react";
import {Button, Form, InputGroup} from 'react-bootstrap'

export function FileUploader(props) {
    const {title, upload_url} = props;

    const [selectedFile, setSelectedFile] = useState();
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [buttonVariant, setButtonVariant] = useState("primary");

    const fileChangeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFileSelected(true);
    };

    const fileSubmissionHandler = () => {
        const formData = new FormData();
        formData.append("File", selectedFile);
        fetch(upload_url, {method: "POST", body: formData})
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result);
                setButtonVariant("success")
            })
            .catch((error) => {
                console.error("Error:", error);
                setButtonVariant("danger");
            });
    };


    return (
        <div>
            <h4>{title}</h4>
            <InputGroup className="mb-3">
                <Form>
                    <Form.Control type="file" onChange={fileChangeHandler} />
                </Form>
                <Button
                    onClick={fileSubmissionHandler}
                    disabled={!isFileSelected}
                    variant={buttonVariant}
                >
                    Upload
                </Button>
            </InputGroup>
        </div>
    );
}
