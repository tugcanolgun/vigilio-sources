import React, { useEffect, useState } from "react";
import SimpleInput from "./SimpleInput";
import FieldInput from "./FieldInput";

const isEmpty = (obj) =>
  obj && Object.keys(obj).length === 0 && obj.constructor === Object;
const setLocal = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const getLocal = (key) => {
  const val = localStorage.getItem(key);
  if (val === null) return "";

  return JSON.parse(val);
};

const AddSchema = () => {
  const [searchInput, setSearchInput] = useState(getLocal("searchInput"));
  const [apiUrl, setApiUrl] = useState(getLocal("apiUrl"));
  const [schemas, setSchemas] = useState(getLocal("schemas"));

  useEffect(() => {
    setLocal("searchInput", searchInput);
    setLocal("apiUrl", apiUrl);
    setLocal("schemas", schemas);
  }, [searchInput, apiUrl, schemas]);

  const addField = () => {
    const rand = Math.random().toString(16).substr(2, 8);
    const schema = { [rand]: { _: rand, key: "", value: "" } };
    setSchemas(Object.assign({}, schemas, schema));
  };

  const updateSchemas = (val) => setSchemas(Object.assign({}, schemas, val));
  const removeSchemas = (key) => {
    if (!schemas.hasOwnProperty(key)) return;

    let temp = JSON.parse(JSON.stringify(schemas));
    delete temp[key];
    setSchemas(temp);
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div>
          <h1>Add a source</h1>
          <SimpleInput
            value={searchInput}
            setValue={setSearchInput}
            placeholder="Search String"
            className="my-2"
          />
          {apiUrl.includes("${searchInput}") ? null : (
            <b>You have to include ${searchInput} in the API url.</b>
          )}
          <SimpleInput
            value={apiUrl}
            setValue={setApiUrl}
            placeholder="API url"
            className="my-2"
          />
          <button onClick={() => addField()} className="btn btn-success my-1">
            Add a field
          </button>
          {Object.keys(schemas).map((keyName, i) => (
            <FieldInput
              key={keyName}
              obj={schemas[keyName]}
              updateFunc={updateSchemas}
              removeFunc={removeSchemas}
            />
          ))}
          {isEmpty(schemas) ? null : (
            <button className="btn btn-success">Test</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSchema;
