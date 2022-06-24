import './App.css';

import React, { useState } from 'react';

function App() {
  const backend_url = 'api/ner';

  // NER Types file states
  const [selectedEntityTypesFile, setSelectedEntityTypesFile] = useState();
  const [isEntityTypesFileSelected, setIsEntityTypesFileSelected] = useState(false);

  // data file states
  const [selectedDataFile, setSelectedDataFile] = useState();
  const [isDataFileSelected, setIsDataFileSelected] = useState(false);

  // Fetch next
  const [nextFetchFilter, setNextFetchFilter] = useState('all');
  const [nextOffset, setNextOffset] = useState(-1);

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
    fetch(backend_url + '/types/upload', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .catch((error) => { console.error('Error:', error) });
  };

  const handleDataFileSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedDataFile);
    fetch(backend_url + '/raw/upload', { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => { console.log('Success:', result) })
      .catch((error) => { console.error('Error:', error) });
  };

  const dataFileChangeHandler = (event) => {
    setSelectedDataFile(event.target.files[0]);
    setIsDataFileSelected(true);
  };

  const getTypesHandler = () => {
    fetch(backend_url + '/types', { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        setEntityTypes(result['entities']);
        setRelationTypes(result['relations'])
      })
      .catch((error) => { console.error('Error:', error) });
  };

  const getNextHandler = (offset_update) => {
    const fetch_offset = nextOffset + offset_update;
    fetch(backend_url + `/raw/next/${nextFetchFilter}/${fetch_offset}`, { method: 'GET' })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        else {
          return null;
      }}) 
      .then((result) => {
        if (result !== null) {
          const r_tokens = result['tokens'];
          const r_entities = result['entities'].map((entity) => {
            return {
              text: r_tokens.slice(entity['start'], entity['end']).join(' '),
              type: entity['type'],
              start: entity['start'],
              end: entity['end'],
              score: entity['score'] ? JSON.stringify(entity['score']) : ''
            }
          });

          const r_relations = result['relations'].map((relation) => {
            return {
              'head': r_entities[relation['head']],
              'tail': r_entities[relation['tail']],
              'type': relation['type'],
              'score': relation['score'] ? JSON.stringify(relation['score']) : ''
            }
          });

          setSampleID(result['_id']);
          setTextData(r_tokens);
          setEntities(r_entities);
          setRelations(r_relations);
          setNextOffset(fetch_offset);
        } else {
          setTextData(['No more data']);
          setEntities([]);
          setRelations([]);
          if (nextOffset > -1) {
            setNextOffset(fetch_offset);
          }
      }})
      .catch((error) => { console.error('Error:', error) });
  };

  const changeStateHandler = (state) => {
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

    fetch(backend_url + `/state/update/${state}`, {
      method: 'POST', 
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((result) => { 
        console.log('Success:', result) ;
        if (nextFetchFilter !== state) {
          setNextOffset(nextOffset - 1);
        }
      })
      .catch((error) => { console.error('Error:', error) });
  };

  // NER labelling UI
  return (
    <div>
      <div className='ControlPanel'>
        <div className="NER_types_inputs">
          <a href={backend_url + '/approved/download'} style={{'marginRight': '5%'}}>
            Download approved data
          </a>
          <span style={{'marginRight': '5%', 'border': '2px solid lightblue'}}>
            <label>Types file: </label>
            <input type="file" onChange={entityTypesFileChangeHandler} />
            <button onClick={handleNERFileSubmission} disabled={!isEntityTypesFileSelected} >Upload</button>
          </span>
          <span style={{'marginRight': '5%', 'border': '2px solid lightblue'}}>
            <label>Data file: </label>
            <input type="file" onChange={dataFileChangeHandler} />
            <button onClick={handleDataFileSubmission} disabled={!isDataFileSelected} >Upload</button>
          </span>
        </div>
        <textarea className='Sentence' value={textData.join(' ')} onSelect={(event) => {
          const start = event.target.selectionStart;
          const end = event.target.selectionEnd;
          setSelectedTextStart(start);
          setSelectedTextEnd(end);
          setSelectedText(event.target.value.substring(start, end));
        }} />
        <span style={{'marginLeft': '30%'}}>
          <select name='Filter' id='filter' onChange={(event) => { 
            setNextOffset(-1); 
            setNextFetchFilter(event.target.value);
            setTextData([]);
            setEntities([]);
            setRelations([]);
            }}>
            <option value='all'>All</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='flag'>Flag</option>
          </select>
          
          <button onClick={() => getNextHandler(-1)}>Get prev</button>
          <button onClick={() => getNextHandler(1)}>Get next</button>
          <button onClick={getTypesHandler}>Get types</button>
          <button onClick={() => changeStateHandler('approved')}>Approve</button>
          <button onClick={() => changeStateHandler('flag')}>Flag</button>
        </span>
        <hr/>
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
        <hr/>
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
        
      </div>
      <hr/>
      <div className='LabelsWrapper'>
        <div className='Label'>
          <p>Entities</p>
          <ul>
            {entities.map((entity, index) => 
              <li style={{width: '100%'}}>
                <p>{entity.text}</p>
                <button pos={index} onClick={handleRemoveEntity}>Delete</button>
                <select name='Entity Type' id={`${index}_entity_type`} value={entity.type} onChange={(e) => {
                  const new_entities = entities.map((entity, i) => {
                    if (i === index) {
                      return { text: entity.text, type: e.target.value, start: entity.start, end: entity.end }
                    }
                    return entity;
                  });
                  new_entities.sort((a, b) => a.start - b.start);
                  setEntities(new_entities);
                }}>
                  {entityTypes.map((entityType, index) => <option value={entityType}>{entityType}</option>)}
                </select>
                <button disabled={!selectedText} onClick={() => {
                    const selected_tokens = selectedText.split(' ');
                    const entity_start = textData.indexOf(selected_tokens[0]);
                    const entity_end = textData.indexOf(selected_tokens[selected_tokens.length - 1]) + 1;
                    const old_entity = entities[index];
                    const new_entities = entities.map((entity, i) => {
                      if (i === index) {
                        return { text: selectedText, type: entity.type, start: entity_start, end: entity_end }
                      }
                      return entity;
                    });

                    const new_relations = relations.map((relation, i) => {
                      let new_head = relation.head;
                      let new_tail = relation.tail;
                      let is_updated = false;

                      if (new_head.start === old_entity.start && new_head.end === old_entity.end) {
                        console.log('head');
                        new_head = { text: selectedText, type: relation.head.type, start: entity_start, end: entity_end };
                        is_updated = true;
                      }

                      if (new_tail.start === old_entity.start && new_tail.end === old_entity.end) {
                        new_tail = { text: selectedText, type: relation.tail.type, start: entity_start, end: entity_end };
                        is_updated = true;
                      }

                      if (is_updated) {
                        return { head: new_head, type: relation.type, tail: new_tail };
                      }
                      return relation
                    });
                    
                    new_entities.sort((a, b) => a.start - b.start);
                    setEntities(new_entities);
                    setRelations(new_relations);
                  }}>
                    Update text
                </button>
                <p>{entity.score}</p>
              </li>
            )}
          </ul>
        </div>
        <div className='Label'>
          <p>Relations</p>
          <ul>
            
            {relations.map((relation, index) => <li pos={index}>
            <button onClick={handleRemoveRelation}> Delete</button>
              {' ' + relation.head.text + ' '}
              <select name='Relation Type' id={`${index}_relation_type`} value={relation.type} onChange={(e) => {
                  const new_relations = relations.map((rel, i) => {
                    if (i === index) {
                      return { head: relation.head, type: e.target.value, tail: relation.tail }
                    }
                    return rel;
                  });
                  setRelations(new_relations);
                }}>
                {relationTypes.map((relationType, index) => <option value={relationType}>{relationType}</option>)}
              </select>
             {' ' + relation.tail.text}
             <p>{relation.score}</p>
             </li>)}
             
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
