import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {backend_url} from '../../config/urls';
import "./style.css";

const Header = () => {
  // NER Types file states
  const [selectedEntityTypesFile, setSelectedEntityTypesFile] = useState();
  const [isEntityTypesFileSelected, setIsEntityTypesFileSelected] = useState(false);
  const [uploadEntityButtonText, setUploadEntityButtonText] = useState('Upload');

  // data file states
  const [selectedDataFile, setSelectedDataFile] = useState();
  const [isDataFileSelected, setIsDataFileSelected] = useState(false);
  const [uploadDataFileButtonText, setUploadDataFileButtonText] = useState('Upload');


  const handleNERFileSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedEntityTypesFile);
    fetch(backend_url + '/types/upload', { method: 'POST', body: formData })
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
    fetch(backend_url + '/raw/upload', { method: 'POST', body: formData })
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


  const entityTypesFileChangeHandler = (event) => {
    setSelectedEntityTypesFile(event.target.files[0]);
    setUploadEntityButtonText('Upload');
    setIsEntityTypesFileSelected(true);
  };

    return (
        <div className="header-container">

<Link to="/abhinav">Abhinav</Link>


        <span style={{'marginRight': '5%', 'border': '2px solid lightblue'}}>
          <label>Types file: </label>
          <input type="file" onChange={entityTypesFileChangeHandler} />
          <button onClick={handleNERFileSubmission} disabled={!isEntityTypesFileSelected} >{uploadEntityButtonText}</button>
        </span>
        <span style={{'marginRight': '5%', 'border': '2px solid lightblue'}}>
          <label>Data file: </label>
          <input type="file" onChange={dataFileChangeHandler} />
          <button onClick={handleDataFileSubmission} disabled={!isDataFileSelected} >{uploadDataFileButtonText}</button>
        </span>
        <a href={backend_url + '/approved/download'} style={{'marginRight': '1%'}}> Download approved </a>
        <a href={backend_url + '/all/download'}> Download all </a>
      </div>
    );
}

export default Header;