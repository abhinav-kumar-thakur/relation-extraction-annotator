import './App.css';

import React, { useState } from 'react';

function App() {

  // NER Types file states
  const [selectedEntityTypesFile, setSelectedEntityTypesFile] = useState();
  const [isEntityTypesFileSelected, setIsEntityTypesFileSelected] = useState(false);

  // data file states
  const [selectedDataFile, setSelectedDataFile] = useState();
  const [isDataFileSelected, setIsDataFileSelected] = useState(false);

  // NER types
  const [entityTypes, setEntityTypes] = useState(['Upload Types File']);
  const [relationTypes, setRelationTypes] = useState(['Upload Types File']);

  // Text data
  const [textData, setTextData] = useState([]);
  const [sampleID, setSampleID] = useState(null);

  // Text selection states
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextStart, setSelectedTextStart] = useState(null);
  const [selectedTextEnd, setSelectedTextEnd] = useState(null);

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
    const newRelations = relations.filter((relation, index) => relation.head.text !== entityToRemove.text && relation.tail.text !== entityToRemove.text);
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

  const handleNERFileSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedEntityTypesFile);
    fetch('http://127.0.0.1:5000/ner/types/upload', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .catch((error) => { console.error('Error:', error) });
  };

  const handleDataFileSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedDataFile);
    fetch('http://127.0.0.1:5000/ner/raw/upload', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .catch((error) => { console.error('Error:', error) });
  };

  const dataFileChangeHandler = (event) => {
    setSelectedDataFile(event.target.files[0]);
    setIsDataFileSelected(true);
  };

  const getTypesHandler = () => {
    fetch('http://127.0.0.1:5000/ner/types', { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEntityTypes(result['entities']);
        setRelationTypes(result['relations'])
      })
      .catch((error) => { console.error('Error:', error) });
  };

  const getNextHandler = () => {
    fetch('http://127.0.0.1:5000/ner/raw/next', { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        const r_tokens = result['tokens'];
        const r_entities = result['entities'].map((entity) => {
          return {
            text: r_tokens.slice(entity['start'], entity['end']).join(' '),
            type: entity['type'],
            start: entity['start'],
            end: entity['end']
          }
        });

        const r_relations = result['relations'].map((relation) => {
          return {
            'head': r_entities[relation['head']],
            'tail': r_entities[relation['tail']],
            'type': relation['type']
          }
        });

        setSampleID(result['_id']);
        setTextData(r_tokens);
        setEntities(r_entities);
        setRelations(r_relations);
      })
  };

  const approveHandler = () => {
    const request_relations = relations.map((relation) => {
      return {
        'head': entities.findIndex((entity) => entity === relation.head),
        'tail': entities.findIndex((entity) => entity === relation.tail),
        'type': relation.type
      }
    });

    const body = {
      '_id': sampleID,
      'entities': entities,
      'relations': request_relations
    };

    fetch('http://127.0.0.1:5000/ner/approve', { 
      method: 'POST', 
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .catch((error) => { console.error('Error:', error) });
  };


  // NER labelling UI
  return (
    <div>
      <div className="NER_types_inputs">
        <span>
          <label>Types file: </label>
          <input type="file" onChange={entityTypesFileChangeHandler} />
          <button onClick={handleNERFileSubmission} disabled={!isEntityTypesFileSelected} >Upload</button>
        </span>
        <span>
          <label>Data file: </label>
          <input type="file" onChange={dataFileChangeHandler} />
          <button onClick={handleDataFileSubmission} disabled={!isDataFileSelected} >Upload</button>
        </span>
      </div>
      <div className="Controls">
        <span>
          <button onClick={getNextHandler}>Get next</button>
          <button onClick={getTypesHandler}>Get types</button>
          <button onClick={approveHandler}>Approve</button>
        </span>
      </div>
      <p> {textData.map((token, index) => `(${index}:${token})`).join('\t')} </p>
      <textarea className='Sentence' value={textData.join(' ')} onSelect={(event) => {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        setSelectedTextStart(start);
        setSelectedTextEnd(end);
        setSelectedText(event.target.value.substring(start, end));
      }} />
      <div className='ActionPanel'>
        <p> Entity Types: </p>
        <select name="Entity Types" id="entitytypes" onChange={(e) => { setSelectedEntityType(e.target.value) }}>
          {entityTypes.map((entityType, index) => <option value={entityType}>{entityType}</option>)}
        </select>
        <p>Text: {selectedText}</p>
        <p>Start: {textData.indexOf(selectedText.split(' ')[0])}</p>
        <p>End: {textData.indexOf(selectedText.split(' ')[selectedText.split(' ').length - 1]) + 1}</p>
        <button disabled={!selectedText} onClick={() => {
          const selected_tokens = selectedText.split(' ');
          const entity_start = textData.indexOf(selected_tokens[0]);
          const entity_end = textData.indexOf(selected_tokens[selected_tokens.length - 1]) + 1;
          const new_entities = entities.concat({ text: selectedText, type: selectedEntityType, start: entity_start, end: entity_end });
          new_entities.sort((a, b) => a.start - b.start);
          setEntities(new_entities);
        }}>
          Add Entity
        </button>
      </div>

      <div className='ActionPanel'>
        <span> From Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => {
          const selected_entity = entities.filter((entity) => entity.text === e.target.value)[0];
          setSelectedFromEntity(selected_entity)
        }}>
          <option value="None">None</option>
          {entities.map((entity, index) => <option value={entity.text}> {entity.text} </option>)}
        </select></span>
        <span> Relation Type: <select name="Relation Types" id="entitytypes" onChange={(e) => { setSelectedRelationType(e.target.value) }}>
          {relationTypes.map((relationType, index) => <option value={relationType}> {relationType} </option>)}
        </select></span>
        <span> To Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => {
          const selected_entity = entities.filter((entity) => entity.text === e.target.value)[0];
          setSelectedToEntity(selected_entity)
        }}>
          <option value="None">None</option>
          {entities.map((entity, index) => <option value={entity.text}> {entity.text} </option>)}
        </select></span>
        <button disabled={selectedFromEntity === "None" && selectedToEntity === "None"} onClick={() => {
          setRelations(relations.concat({ head: selectedFromEntity, type: selectedRelationType, tail: selectedToEntity }));
        }}>
          Add Relation
        </button>
      </div>
      <div className='LabelsWrapper'>
        <div className='Label'>
          <p>Entities</p>
          <ul>
            {entities.map((entity, index) => <li pos={index} onClick={handleRemoveEntity}> {entity.text} {"->"} {entity.type}</li>)}
          </ul>
        </div>
        <div className='Label'>
          <p>Relations</p>
          <ul>
            {relations.map((relation, index) => <li pos={index} onClick={handleRemoveRelation}> {relation.head.text} {"->"} {relation.type} {"->"} {relation.tail.text}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
