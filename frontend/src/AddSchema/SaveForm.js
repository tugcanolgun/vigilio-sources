import React, {useEffect, useState} from 'react';
import SimpleInput from "./SimpleInput";
import SimpleCheck from "./SimpleCheck";
import {delLocal, getCSRFToken, getLocal, setLocal} from "../utils";
import getError from "../getError";
import axios from "axios";
import {useHistory} from "react-router-dom";

const SaveForm = ({schema}) => {
  const [name, setName] = useState(getLocal('saveFormName'));
  const [isNonLegal, setIsNonLegal] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (name.length === 0 && saveButton)
      setSaveButton(false);

    if (name.length > 50) {
      setSaveButton(false);
      setErrorMessage('Name cannot be more than 50 characters.');
    }

    if (name.length > 0 && name.length < 50 && !saveButton)
      setSaveButton(true);

    setLocal('saveFormName', name);
  }, [name]);

  const publishSchema = () => {
    setErrorMessage('');
    axios.post('/api/schemas/',
      {
        version: schema.version,
        name: name,
        api_url: schema.apiUrl,
        schema: JSON.stringify(schema),
        is_legal: !isNonLegal,
        is_active: true,
      }, {
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      })
      .then(response => {
        setInfoMessage('Success. Redirecting to home.')
        setTimeout(() => history.push('/'), 1500);
        delLocal('saveFormName');
        delLocal('searchInput');
        delLocal('apiUrl');
      })
      .catch(err => {
        setErrorMessage(getError(err));
      })
  }

  const renderError = () => {
    if (errorMessage === '')
      return;

    return (
      <div className="border">
        <span className="mx-3 my-2" style={{fontSize: 18, color: '#933636'}}>{errorMessage}</span>
      </div>
    );
  }

  const renderInfo = () => {
    if (infoMessage === '')
      return;

    return (
      <div className="border">
        <span className="mx-3 my-2" style={{fontSize: 18, color: '#3e2c6b'}}>{infoMessage}</span>
      </div>
    );
  }

  return (
    <div>
      <h1>Save this source</h1>
      {renderError()}
      {renderInfo()}
      <SimpleInput value={name} setValue={setName} placeholder='Name for this schema' className="my-2"/>
      <SimpleCheck value={isNonLegal} setValue={setIsNonLegal} text={'Does this schema contain any illegal content?'}
                   className="my-2"/>
      {saveButton ? <button onClick={() => publishSchema()} className="btn btn-success">Publish</button> : null}
    </div>
  );
}

export default SaveForm;
