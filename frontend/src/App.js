import './App.css';

import React, { useState } from 'react';

function App() {
  // NER types
  const [entityTypes, setEntityTypes] = useState(['Upload Types File']);
  const [relationTypes, setRelationTypes] = useState(['Upload Types File']);

  // NER Types states
  const [selectedEntityTypesFile, setSelectedEntityTypesFile] = useState();
  const [isEntityTypesFileSelected, setIsEntityTypesFileSelected] = useState(false);

  // Text selection states
  const [selectedText, setSelectedText] = useState('Initial value');
  const [selectedTextStart, setSelectedTextStart] = useState(-1);
  const [selectedTextEnd, setSelectedTextEnd] = useState(-1);
  // Create Entity states
  const [entities, setEntities] = useState([]);
  const [selectedEntityType, setSelectedEntityType] = useState(entityTypes[0]);
  // Create Relation states
  const [relations, setRelations] = useState([]);
  const [selectedRelationType, setSelectedRelationType] = useState(relationTypes[0]);
  const [selectedFromEntity, setSelectedFromEntity] = useState('None');
  const [selectedToEntity, setSelectedToEntity] = useState('None');

  // Handlers
  const handleRemoveEntity = (e) => {
    const indexToRemove = e.target.getAttribute("pos");
    const entityToRemove = entities[indexToRemove];
    const newEntities = entities.filter((entity, index) => entity !== entityToRemove);
    const newRelations = relations.filter((relation, index) => relation.from !== entityToRemove.text && relation.to !== entityToRemove.text);
    setEntities(newEntities);
    setRelations(newRelations);
  };

  const handleRemoveRelation = (e) => {
    const indexToRemove = e.target.getAttribute("pos");
    const relationToRemove = relations[indexToRemove];
    const newRelations = relations.filter((relation, index) => relation !== relationToRemove);
    setRelations(newRelations);
  };

  const entityTypesFileChangeHandler = (event) => {
    setSelectedEntityTypesFile(event.target.files[0]);
    setIsEntityTypesFileSelected(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedEntityTypesFile);
    fetch('http://127.0.0.1:5000/ner/types/upload', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .then(
        fetch('http://127.0.0.1:5000/ner/types', { method: 'GET' })
          .then((response) => response.json())
          .then((result) => {
            setEntityTypes(result['entities']);
            setRelationTypes(result['relations'])
          })
      )
      .catch((error) => { console.error('Error:', error) });
  };

  // NER labelling UI
  return (
    <div>
      <div className="NER_types_inputs">
        <span>
          <label>Types file: </label>
          <input type="file" onChange={entityTypesFileChangeHandler} />
          <button onClick={handleSubmission} disabled={!isEntityTypesFileSelected} >Upload</button>
        </span>
      </div>
      <textarea className='Sentence' onSelect={(event) => {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        setSelectedTextStart(start);
        setSelectedTextEnd(end);
        setSelectedText(event.target.value.substring(start, end));
      }}>
        Elon Musk is a co-founder and CEO of SpaceX and Tesla Motors. He is also owner of Twitter, Inc.
      </textarea>

      <div className='ActionPanel'>
        <p> Entity Types: </p>
        <select name="Entity Types" id="entitytypes" onChange={(e) => { setSelectedEntityType(e.target.value) }}>
          {entityTypes.map((entityType, index) => <option value={entityType}>{entityType}</option>)}
        </select>
        <button disabled={!selectedText} onClick={() => { setEntities(entities.concat({ text: selectedText, type: selectedEntityType })) }}>
          Add Entity
        </button>
        <p>Start: {selectedTextStart}</p>
        <p>End: {selectedTextEnd}</p>
        <p>Text: {selectedText}</p>
      </div>

      <div className='ActionPanel'>
        <span> From Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => { setSelectedFromEntity(e.target.value) }}>
          <option value="None">None</option>
          {entities.map((entity, index) => <option value={entity.text}> {entity.text} </option>)}
        </select></span>
        <span> Relation Type: <select name="Relation Types" id="entitytypes" onChange={(e) => { setSelectedRelationType(e.target.value) }}>
          {relationTypes.map((relationType, index) => <option value={relationType}> {relationType} </option>)}
        </select></span>
        <span> To Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => { setSelectedToEntity(e.target.value) }}>
          <option value="None">None</option>
          {entities.map((entity, index) => <option value={entity.text}> {entity.text} </option>)}
        </select></span>
        <button disabled={selectedFromEntity === "None" && selectedToEntity === "None"} onClick={() => {
          setRelations(relations.concat({ from: selectedFromEntity, type: selectedRelationType, to: selectedToEntity }));
        }}>
          Add Relation
        </button>
      </div>
      <div className='LabelsWrapper'>
        <div className='Label'>
          <p>Entities</p>
          <ul>
            {entities.map((entity, index) => <li pos={index} onClick={handleRemoveEntity}> {entity.text}:.:{entity.type}</li>)}
          </ul>
        </div>
        <div className='Label'>
          <p>Relations</p>
          <ul>
            {relations.map((relation, index) => <li pos={index} onClick={handleRemoveRelation}> {relation.from}:.:{relation.type}:.:{relation.to}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
