import React, { useState } from "react";
import axios from "axios";
import getError from "../getError";
import { inject } from "../utils";
import SimpleInput from "../AddSchema/SimpleInput";
import MudParser from "mud-parser";

const TestSchema = ({ schema, setResults }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const testSchema = () => {
    axios
      .get(inject(schema.apiUrl, { searchInput }))
      .then((response) => {
        console.log(response.data);
        let result = MudParser(schema, response.data);
        console.log(result);
        setResults(result);
      })
      .catch((err) => {
        console.log(getError(err));
      });
  };

  const renderBody = () => {
    if (!showInput)
      return (
        <button
          onClick={() => setShowInput(true)}
          className="btn btn-sm btn-success"
        >
          Test
        </button>
      );

    return (
      <div className="d-flex justify-content-between">
        <SimpleInput
          value={searchInput}
          setValue={setSearchInput}
          placeholder="Search query"
        />
        <button onClick={() => testSchema()} className="btn btn-sm btn-success">
          Test
        </button>
      </div>
    );
  };

  return renderBody();
};

export default TestSchema;
