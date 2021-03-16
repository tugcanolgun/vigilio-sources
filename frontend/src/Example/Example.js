import React, {useState} from "react";
import axios from "axios";
import Input from "./Input";
import Result from "../AddSchema/Result";
import MudParser from "mud-parser";
import {Link} from "react-router-dom";
import SimpleInput from "../AddSchema/SimpleInput";
import {inject} from "../utils";

const Example = () => {
  const [searchInput, setSearchInput] = useState("");
  const [apiUrl, setApiUrl] = useState("https://yts.mx/api/v2/list_movies.json?query_term=${searchInput}");
  const [results, setResults] = useState([]);
  const [inputs, setInputs] = useState({
    title: {
      _: "title",
      key: "title",
      value: "data.movies.0.title",
      placeHolder: "Title",
    },
    imdbId: {
      _: "imdbId",
      key: "imdbId",
      value: "data.movies.0.imdb_code",
      placeHolder: "IMDB ID",
    },
    image: {
      _: "image",
      key: "image",
      value: "data.movies.0.small_cover_image",
      placeHolder: "An image source",
    },
    year: {
      _: 'year',
      key: 'year',
      value: 'data.movies.0.year',
      placeHolder: 'Year'
    },
    source: {
      _: "source",
      key: "source",
      value: "data.movies.0.torrents|sources.0.url",
      placeHolder: "Torrent source (url or magnet)",
    },
    quality: {
      _: 'quality',
      key: 'quality',
      value: 'data.movies.0.torrents|sources.0.quality',
      placeHolder: 'Quality or resolution'
    },
    seeds: {
      _: "seeds",
      key: "seeds",
      value: "data.movies.0.torrents|sources.0.seeds",
      placeHolder: "Torrent source (url or magnet)",
    },
    size: {
      _: "size",
      key: "size",
      value: "data.movies.0.torrents|sources.0.size",
      placeHolder: "Size (string)",
    },
    type: {
      _: 'type',
      key: 'type',
      value: 'data.movies.0.torrents|sources.0.type',
      placeHolder: 'Type of torrent (bluray, web, webrip, etc.)'
    },
  });
  const [loading, setLoading] = useState(false);

  const fetchLink = () => {
    setLoading(true);
    setResults([]);
    axios.get(inject(apiUrl, {searchInput}))
      .then((response) => {
        setLoading(false);
        let schema = {version: 1, parsers: []};
        Object.keys(inputs).map((keyName) => {
          schema.parsers.push(inputs[keyName]);
        });

        let result = MudParser(schema, response.data);
        setResults(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getSchema = () => {
    return {
      version: 1,
      apiUrl: apiUrl,
      parsers: Object.keys(inputs).map(k => {
        return {key: inputs[k].key, value: inputs[k].value}
      })
    }
  }

  const updateInput = (val) => {
    setInputs(Object.assign({}, inputs, val));
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div>
          <Link to={'/add'}>
            Go back to adding a source
          </Link>
          <h1>Example</h1>
          <SimpleInput value={searchInput} setValue={setSearchInput} placeholder="Search String" className="my-2"/>
          <SimpleInput value={apiUrl} setValue={setApiUrl} placeholder="API Url" className="my-2"/>
          {Object.keys(inputs).map((keyName, i) => (
            <Input key={keyName} obj={inputs[keyName]} updateFunc={updateInput}/>
          ))}
          <button onClick={() => fetchLink()} className="btn btn-success">
            Test
          </button>
          {loading ? " Requesting..." : ""}
          <div className="my-5">
            {results.map((result, index) => {
              if (index > 2)
                return;
              return <Result key={index} data={result}/>
            })}
          </div>
          <div className="my-5">
            <textarea className="form-control" style={{width: '100%', height: 250}}
                      defaultValue={JSON.stringify(getSchema(), null, 2)}
            >
            </textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;
