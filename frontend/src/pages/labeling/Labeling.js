import './Labeling.css';

import {v4 as uuidv4} from 'uuid';
import React, {useState} from 'react';
import StackedProgressBar from '../../components/progressbar/progessBar';
import CloseButton from 'react-bootstrap/CloseButton';
import {DataUpdateURL, GetDataURL, GetTypesURL, LabelingProgressURL} from "../../configs/urls";

function Labeling() {
    // Progress bar
    const [progress, setProgress] = useState(null);

    // Fetch next
    const [nextFetchFilter, setNextFetchFilter] = useState('all');
    const [nextOffset, setNextOffset] = useState(-1);

    // NER types
    const [entityTypes, setEntityTypes] = useState([]);
    const [relationTypes, setRelationTypes] = useState([]);

    // Text data
    const [textData, setTextData] = useState([]);
    const [sampleID, setSampleID] = useState(null);

    // Text selection states
    const [textSelectionState, setTextSelectionState] = useState({text: '', start: -1, end: -1, valid: false});

    // Create Entity states
    const [entities, setEntities] = useState([]);
    const [selectedEntityType, setSelectedEntityType] = useState(null);

    // Create Relation states
    const [relations, setRelations] = useState([]);
    const [selectedRelationType, setSelectedRelationType] = useState(null);
    const [selectedFromEntity, setSelectedFromEntity] = useState(null);
    const [selectedToEntity, setSelectedToEntity] = useState(null);

    // control Panel Message
    const [controlPanelMessage, setControlPanelMessage] = useState(` Hint: Start with 'Get types'`)

    // Handlers
    const handleRemoveEntity = (e) => {
        const entityIdToRemove = e.target.getAttribute("id");
        const newEntities = entities.filter((entity) => entity.id !== entityIdToRemove);
        const newRelations = relations.filter((relation) => relation.head.id !== entityIdToRemove && relation.tail.id !== entityIdToRemove);
        setEntities(newEntities);
        setRelations(newRelations);
    };

    const handleRemoveRelation = (e) => {
        const relationIdToRemove = e.target.getAttribute("id");
        const newRelations = relations.filter((relation) => relation.id !== relationIdToRemove);
        setRelations(newRelations);
    };

    const getTypesHandler = () => {
        fetch(GetTypesURL, {method: 'GET'})
            .then((response) => response.json())
            .then((result) => {
                setEntityTypes(result['entities']);
                setRelationTypes(result['relations']);
                setControlPanelMessage(` Hint: Use 'Get next/prev to navigate'`);
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    };

    const updateProgress = () => {
        fetch(LabelingProgressURL, {method: 'GET'})
            .then((response) => response.json())
            .then((result) => setProgress(result))
            .catch((error) => {
                console.log(error);
                setProgress(null)
            });
    };

    const getNextHandler = (offset_update) => {
        const fetch_offset = nextOffset + offset_update;
        updateProgress();

        fetch(`${GetDataURL}/${nextFetchFilter}/${fetch_offset}`, {method: 'GET'})
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((result) => {
                if (result !== null) {
                    const r_tokens = result['tokens'];
                    const r_entities = result['entities'].map((entity) => {
                        return {
                            id: uuidv4(),
                            text: r_tokens.slice(entity['start'], entity['end']).join(' '),
                            type: entity['type'],
                            start: entity['start'],
                            end: entity['end'],
                            score: entity['score'] ? entity['score'] : null
                        }
                    });

                    const r_relations = result['relations'].map((relation) => {
                        return {
                            id: uuidv4(),
                            head: r_entities[relation['head']],
                            tail: r_entities[relation['tail']],
                            type: relation['type'],
                            score: relation['score'] ? relation['score'] : null
                        }
                    });

                    setSampleID(result['_id']);
                    setTextData(r_tokens);
                    setEntities(r_entities);
                    setRelations(r_relations);
                    setNextOffset(fetch_offset);
                    setTextSelectionState({text: '', start: -1, end: -1, valid: false});
                    setControlPanelMessage(` Status: ${result['status']}`)
                } else {
                    setTextData(['No more data']);
                    setEntities([]);
                    setRelations([]);
                    if (nextOffset > -1) {
                        setNextOffset(fetch_offset);
                    }
                    setControlPanelMessage(` Hint: Navigate in opposite direction`)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    };

    const changeStateHandler = (state) => {
        const request_relations = relations.map((relation) => {
            return {
                'head': entities.findIndex((entity) => entity.id === relation.head.id),
                'tail': entities.findIndex((entity) => entity.id === relation.tail.id),
                'type': relation.type
            }
        });

        const body = {
            '_id': sampleID,
            'entities': entities,
            'relations': request_relations
        };

        fetch(`${DataUpdateURL}/${state}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((result) => {
                if (result['status'] === 'Failure') {
                    console.log('Error:', result);
                    setControlPanelMessage(` No update`);
                    return
                }
                console.log('Success:', result);
                setControlPanelMessage(` Updated status: ${state}`);
                if (nextFetchFilter !== state && nextFetchFilter !== 'all') {
                    setNextOffset(nextOffset - 1);
                }

                updateProgress();
            })
            .catch((error) => {
                console.error('Error:', error);
                setControlPanelMessage(` Update status failed: ${error}`);
            });
    };

    const textSelectionHandler = (event) => {
        let traversed_length = 0;
        let entity_start_index, entity_end_inedx;
        for (const [i, token] of textData.entries()) {

            const token_start = traversed_length;
            const token_end = traversed_length + token.length;
            if (event.target.selectionStart >= token_start && event.target.selectionStart <= token_end) {
                entity_start_index = i;
            }

            if (event.target.selectionEnd >= token_start && event.target.selectionEnd <= token_end) {
                entity_end_inedx = i + 1;
            }

            traversed_length += token.length + 1;
            if (entity_start_index && entity_end_inedx) {
                break;
            }
        }

        const isValid = entity_start_index !== -1 && entity_end_inedx !== -1;
        const selectionText = textData.slice(entity_start_index, entity_end_inedx).join(' ');
        setTextSelectionState({text: selectionText, start: entity_start_index, end: entity_end_inedx, valid: isValid});
    }

    // NER labelling UI
    return (
        <div>
            <div className='ControlPanel'>
                <StackedProgressBar data={progress}/>
                <textarea className='Sentence' value={textData.join(' ')} onSelect={textSelectionHandler}/>
                <span style={{'marginLeft': '30%'}}>
          <select name='Filter' id='filter' onChange={(event) => {
              setNextOffset(-1);
              setNextFetchFilter(event.target.value);
              setTextData([]);
              setEntities([]);
              setRelations([]);
              setControlPanelMessage(` Hint: Use 'Get next/prev to navigate'`);
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
          <text>{controlPanelMessage}</text>
        </span>
                <hr/>
                <div className='ActionPanel'>
                    <p> Entity Types: </p>
                    <select name="Entity Types" id="entitytypes" onChange={(e) => {
                        setSelectedEntityType(e.target.value)
                    }}>
                        <option value={null}>Select Entity Type</option>
                        {entityTypes.map((entityType) => <option value={entityType}>{entityType}</option>)}
                    </select>
                    <p>Text: {textSelectionState.text}</p>
                    <p>Start: {textSelectionState.start}</p>
                    <p>End: {textSelectionState.end}</p>
                    <button disabled={!textSelectionState.valid || !selectedEntityType} onClick={() => {
                        const new_entities = entities.concat({
                            id: uuidv4(),
                            text: textSelectionState.text,
                            type: selectedEntityType,
                            start: textSelectionState.start,
                            end: textSelectionState.end
                        });
                        new_entities.sort((a, b) => a.start - b.start);
                        setEntities(new_entities);
                    }}>
                        Add Entity
                    </button>
                </div>
                <hr/>
                <div className='ActionPanel'>
          <span> From Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => {
              const selected_entity = e.target.value ? entities.filter((entity) => entity.id === e.target.value)[0] : null;
              setSelectedFromEntity(selected_entity);
          }}>
            <option>Select Entity</option>
              {entities.map((entity) => <option
                  value={entity.id}>{entity.text} ({entity.start}, {entity.end})</option>)}
          </select></span>
                    <span> Relation Type: <select name="Relation Types" id="entitytypes" onChange={(e) => {
                        setSelectedRelationType(e.target.value)
                    }}>
            <option value={null}>Select Relation Type</option>
                        {relationTypes.map((relationType) => <option value={relationType}> {relationType} </option>)}
          </select></span>
                    <span> To Entity: <select name="Relation Types" id="entitytypes" onChange={(e) => {
                        const selected_entity = e.target.value ? entities.filter((entity) => entity.id === e.target.value)[0] : null;
                        setSelectedToEntity(selected_entity);
                    }}>
            <option>Select Entity</option>
                        {entities.map((entity) => <option
                            value={entity.id}>{entity.text} ({entity.start}, {entity.end})</option>)}
          </select></span>
                    <button disabled={!(selectedFromEntity && selectedToEntity) || !selectedRelationType}
                            onClick={() => {
                                setRelations(relations.concat({
                                    id: uuidv4(),
                                    head: selectedFromEntity,
                                    type: selectedRelationType,
                                    tail: selectedToEntity
                                }));
                            }}>
                        Add Relation
                    </button>
                </div>
            </div>
            <div className='LabelsWrapper'>
                <div className='Label'>
                    <h4>Entities</h4>
                    <ul className='LabelList'>
                        {entities.map((entity, index) =>
                            <li style={{width: '100%'}}>
                                <p>
                                    <CloseButton id={entity.id}
                                                 onClick={handleRemoveEntity}/> {entity.text} ({entity.start}, {entity.end})
                                </p>
                                <select name='Entity Type' value={entity.type} onChange={(e) => {
                                    const new_entities = entities.map((entity, i) => {
                                        if (i === index) {
                                            return {
                                                id: entity.id,
                                                text: entity.text,
                                                type: e.target.value,
                                                start: entity.start,
                                                end: entity.end
                                            }
                                        }
                                        return entity;
                                    });
                                    new_entities.sort((a, b) => a.start - b.start);
                                    setEntities(new_entities);
                                }}>
                                    {entityTypes.map((entityType, index) => <option
                                        value={entityType}>{entityType}</option>)}
                                </select>
                                <button disabled={!textSelectionState.valid} onClick={() => {
                                    const old_entity = entities[index];
                                    const new_entity = {
                                        id: entity.id,
                                        text: textSelectionState.text,
                                        type: entity.type,
                                        start: textSelectionState.start,
                                        end: textSelectionState.end
                                    }
                                    const new_entities = entities.map((entity, i) => {
                                        if (i === index) {
                                            return new_entity
                                        }
                                        return entity;
                                    });

                                    const new_relations = relations.map((relation, i) => {
                                        let new_head = relation.head;
                                        let new_tail = relation.tail;
                                        let is_updated = false;

                                        if (new_head.start === old_entity.start && new_head.end === old_entity.end) {
                                            new_head = new_entity;
                                            is_updated = true;
                                        }

                                        if (new_tail.start === old_entity.start && new_tail.end === old_entity.end) {
                                            new_tail = new_entity;
                                            is_updated = true;
                                        }

                                        if (is_updated) {
                                            return {
                                                id: relation.id,
                                                head: new_head,
                                                type: relation.type,
                                                tail: new_tail
                                            };
                                        }
                                        return relation
                                    });

                                    new_entities.sort((a, b) => a.start - b.start);
                                    setEntities(new_entities);
                                    setRelations(new_relations);
                                }}>
                                    Update text
                                </button>
                                <p>{entity.score ? JSON.stringify(entity.score) : ''}</p>
                            </li>
                        )}
                    </ul>
                </div>
                <div className='Label'>
                    <h4>Relations</h4>
                    <ul className='LabelList'> {relations.map((relation, index) => <li pos={index}>
                        <CloseButton id={relation.id} onClick={handleRemoveRelation}/>
                        {' ' + relation.head.text} ({relation.head.start})
                        <select name='Relation Type' id={`${index}_relation_type`} value={relation.type}
                                onChange={(e) => {
                                    const new_relations = relations.map((rel, i) => {
                                        if (i === index) {
                                            return {
                                                id: relation.id,
                                                head: relation.head,
                                                type: e.target.value,
                                                tail: relation.tail
                                            }
                                        }
                                        return rel;
                                    });
                                    setRelations(new_relations);
                                }}>
                            {relationTypes.map((relationType) => <option value={relationType}>{relationType}</option>)}
                        </select>
                        {' ' + relation.tail.text} ({relation.tail.start})
                        <p>{relation.score ? JSON.stringify(relation.score) : ''}</p>
                    </li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Labeling;
