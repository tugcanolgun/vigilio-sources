import React, {useEffect, useState} from 'react';
import SimpleInput from "./SimpleInput";
import FieldInput from "./FieldInput";
import axios from "axios";
import MudParser from "mud-parser";
import getError from "../getError";
import Result from "../AddSource/Result";
import {ArrowLeftCircleSvg} from "../svg";
import SaveForm from "./SaveForm";
import {Link} from "react-router-dom";
import {getLocal, inject, setLocal} from "../utils";

const AddSchema = () => {
  const [searchInput, setSearchInput] = useState(getLocal('searchInput'));
  const [apiUrl, setApiUrl] = useState(getLocal('apiUrl'));
  const [schemas, setSchemas] = useState(getLocal('schemas'));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState('addSchema');

  useEffect(() => {
    setLocal('searchInput', searchInput);
    setLocal('apiUrl', apiUrl);
    setLocal('schemas', schemas);
  }, [searchInput, apiUrl, schemas]);

  const updateSchemas = val => setSchemas(Object.assign({}, schemas, val));

  const fetchLink = () => {
    setLoading(true);
    setResults([]);
    axios
      .get(inject(apiUrl, {searchInput}))
      .then((response) => {
        setLoading(false);
        let schema = {version: 1, apiUrl, parsers: []};
        Object.keys(schemas).map((keyName) => {
          schema.parsers.push(schemas[keyName]);
        });

        let result = MudParser(schema, response.data);
        setResults(result);
        window.location = '#results';
      })
      .catch((err) => {
        setLoading(false);
        console.log(getError(err));
      });
  };

  const renderResults = () => {
    if (results.length <= 0)
      return;

    return (
      <div className="my-5" id="results">
        <h4 className="my-4">Example output</h4>
        {results.map((result, index) => {
          if (index > 2)
            return;
          return <Result key={index} data={result}/>
        })}
      </div>
    );
  }

  const isMandatoryResult = () => {
    if (results.length === 0)
      return;

    if (results[0].imdbId === undefined || results[0].sources === undefined)
      return false;

    if (results[0].sources.length === 0 || results[0].sources[0].source === undefined)
      return false;

    return apiUrl.includes('${searchInput}');
  }

  const isMandatoryFilled = () => {
    return !(schemas.imdbId.value === '' || schemas.source.value === '');
  }

  const getSchema = () => {
    let parsers = [];
    Object.keys(schemas).map(k => {
      if (schemas[k].value !== '')
        parsers.push({key: schemas[k].key, value: schemas[k].value});
    });
    return {
      version: 1,
      apiUrl,
      parsers
    }
  }

  const renderPage = () => {
    if (page === 'addSchema') {
      return (
        <>
          <Link to={'/example'}>
            Check out the example
          </Link>
          <h1>Add a source</h1>
          <SimpleInput value={searchInput} setValue={setSearchInput} placeholder='Search String' className="my-2"/>
          {apiUrl.includes('${searchInput}') ? null : <b>You have to include {'${searchInput}'} in the API url.</b>}
          <SimpleInput value={apiUrl} setValue={setApiUrl} placeholder='API url' className="my-2"/>
          {Object.keys(schemas).map((keyName, i) => {
            return <FieldInput key={keyName} obj={schemas[keyName]} updateFunc={updateSchemas}/>;
          })}
          <button onClick={() => fetchLink()} className="btn btn-success">Test</button>
          {results.length !== 0 ? <button disabled={!isMandatoryResult()} style={{marginLeft: 18}}
                                          onClick={() => setPage('saveForm')}
                                          className="btn btn-success">Save</button> : null}
          {isMandatoryFilled() ? null : <b className="mx-3">imdbId and source has to be filled</b>}
          {loading ? <div className="my-2"><h3>Loading...</h3></div> : null}
          {renderResults()}
        </>
      );
    } else if (page === 'saveForm') {
      return (
        <>
          <a onClick={() => setPage('addSchema')} style={{cursor: 'pointer'}}>
            <ArrowLeftCircleSvg/> Go back
          </a>
          <SaveForm schema={getSchema()}/>
          <div className="my-3">
            <textarea className="form-control" style={{width: '100%', height: 250}}
                      disabled={true}
                      defaultValue={JSON.stringify(getSchema(), null, 2)}
            >
            </textarea>
          </div>
        </>
      );
    }
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default AddSchema;
