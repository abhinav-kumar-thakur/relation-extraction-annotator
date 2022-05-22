import './App.css';

import React, { useState } from 'react';

function App() {
  const entityTypes = ['PERSON', 'LOCATION', 'ORGANIZATION', 'MISC'];
  const relationTypes = ['Employee', 'Other']

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

  const handleRemoveEntity = (e) => {
    const indexToRemove = e.target.getAttribute("pos");
    const entityToRemove = entities[indexToRemove];
    const newEntities = entities.filter((entity, index) => entity !== entityToRemove);
    setEntities(newEntities);
  };

  const handleRemoveRelation = (e) => {
    const indexToRemove = e.target.getAttribute("pos");
    const relationToRemove = relations[indexToRemove];
    const newRelations = relations.filter((relation, index) => relation !== relationToRemove);
    setRelations(newRelations);
  };

  return (
    <div>
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
        <select name="Entity Types" id="entitytypes" onChange={(e) => { setSelectedEntityType(e.target.value) }}>
          {entityTypes.map((entityType, index) => <option value={entityType}>{entityType}</option>)}
        </select>
        <button onClick={() => { setEntities(entities.concat({ text: selectedText, type: selectedEntityType })) }}>
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
        <button onClick={() => {
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
