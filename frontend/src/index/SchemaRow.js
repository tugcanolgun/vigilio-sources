import React, { useEffect, useState } from "react";
import {
  ClipboardCheckSvg,
  HandThumbsDownFillSvg,
  HandThumbsDownSvg,
  HandThumbsUpFillSvg,
  HandThumbsUpSvg,
} from "../svg";
import Modal from "./Modal";
import { getCSRFToken, getLocal, setLocal } from "../utils";
import axios from "axios";
import TestSchema from "./TestSchema";
import Result from "../AddSchema/Result";

const thStyle = {
  color: "#3e2c6b",
};

const SchemaRow = ({ schema }) => {
  const [thumbsUp, setThumbsUp] = useState(getLocal(`${schema.id}thumbsUp`));
  const [thumbsDown, setThumbsDown] = useState(
    getLocal(`${schema.id}thumbsDown`)
  );
  const [showClipboard, setShowClipboard] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setLocal(`${schema.id}thumbsUp`, thumbsUp);
    setLocal(`${schema.id}thumbsDown`, thumbsDown);
  }, [thumbsUp, thumbsDown]);

  const postThumbs = (val) => {
    {
      val > 0 ? setThumbsUp(!thumbsUp) : setThumbsDown(!thumbsDown);
    }
    if (getLocal(`${schema.id}_`)) return;

    axios
      .post(
        `/api/score/`,
        {
          schema: schema.id,
          score: val,
        },
        {
          headers: {
            "X-CSRFToken": getCSRFToken(),
          },
        }
      )
      .then((response) => {
        console.log("success.");
        setLocal(`${schema.id}_`, true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderThumbsUp = () => {
    if (thumbsDown)
      return (
        <a>
          <HandThumbsUpSvg style={thStyle} />
        </a>
      );

    return (
      <a onClick={() => postThumbs(1)} style={{ cursor: "pointer" }}>
        {thumbsUp ? (
          <HandThumbsUpFillSvg style={thStyle} />
        ) : (
          <HandThumbsUpSvg style={thStyle} />
        )}
      </a>
    );
  };

  const renderThumbsDown = () => {
    if (thumbsUp)
      return (
        <a>
          <HandThumbsDownSvg style={thStyle} />
        </a>
      );

    return (
      <a onClick={() => postThumbs(-1)} style={{ cursor: "pointer" }}>
        {thumbsDown ? (
          <HandThumbsDownFillSvg style={thStyle} />
        ) : (
          <HandThumbsDownSvg style={thStyle} />
        )}
      </a>
    );
  };

  const getScore = () => schema.score + thumbsUp - thumbsDown;

  const copyText = ({ text }) => {
    navigator.clipboard
      .writeText(JSON.stringify(text))
      .then(() => {
        console.log("copied.");
        setShowClipboard(true);
        setTimeout(() => setShowClipboard(false), 2000);
      })
      .catch((err) => {
        console.log("error.", err);
      });
  };

  const renderCopyButton = () => {
    if (schema.is_legal)
      return (
        <button
          onClick={() =>
            copyText({ text: JSON.parse(schema.schema.replace(/\'/g, '"')) })
          }
          className="btn btn-sm btn-success my-1"
        >
          Copy source
        </button>
      );

    return (
      <Modal
        title="CAUTION!"
        body="This source may contain illegal results. Are you sure?"
        buttonText="Copy"
        refFunc={copyText}
        refFuncArgs={{ text: JSON.parse(schema.schema.replace(/\'/g, '"')) }}
      >
        <button className="btn btn-sm btn-success my-1">Copy source</button>
      </Modal>
    );
  };

  const renderClipboard = () => {
    if (showClipboard)
      return <ClipboardCheckSvg style={{ color: "green", marginLeft: 15 }} />;
  };

  const renderResults = () => {
    if (results.length === 0) return;

    return (
      <div className="my-5">
        {results.map((result, index) => {
          if (index > 2) return;
          return <Result key={index} data={result} />;
        })}
      </div>
    );
  };

  return (
    <div className="py-2">
      <div className="row">
        <div className="col">
          <span style={{ fontSize: 20, ...thStyle }}>{schema.name}</span>
        </div>
        <div className="col-3 text-end">
          <div className="d-flex justify-content-evenly flex-nowrap">
            {renderThumbsUp()}
            {renderThumbsDown()}
            <span style={{ fontSize: 20, ...thStyle }}>{getScore()}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col align-self-center">
          <TestSchema
            schema={JSON.parse(schema.schema.replace(/\'/g, '"'))}
            setResults={setResults}
          />
        </div>
        <div className="col text-end">
          {renderClipboard()}
          {renderCopyButton()}
        </div>
      </div>
      {renderResults()}
      <hr />
    </div>
  );
};

export default SchemaRow;
