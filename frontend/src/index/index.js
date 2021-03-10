import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SchemaRow from "./SchemaRow";


const Index = () => {
  const [schemas, setSchemas] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    fetchSchemas('/api/schemas');
  }, [])

  const fetchSchemas = (url) => {
    axios.get(url)
      .then(response => {
        setFetched(true);
        console.log(response.data);
        response.data && setSchemas(response.data.results);
        response.data && setNext(response.data.next);
        response.data && setPrevious(response.data.previous);
      })
      .catch(err => {
        setFetched(true);
      })
  }

  return (
    <div className="container-fluid">
      <div className="container">
        <div>
          <h1>Sources</h1>
          {fetched ? null : <h2>Loading...</h2>}
          <hr/>
          {schemas.map(schema => {
            return <SchemaRow key={schema.id} schema={schema}/>;
          })}
        </div>
        <div className="d-flex my-3 justify-content-between">
          {previous !== null ?
            <button onClick={() => fetchSchemas(previous)} className="btn btn-sm btn-success">Previous</button> :
            <p></p>}
          {next !== null ? <button onClick={() => fetchSchemas(next)} className="btn btn-sm btn-success">Next</button> :
            <p></p>}
        </div>
      </div>
    </div>
  );
};

export default Index;
