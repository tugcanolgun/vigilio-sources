import React from 'react';

const SimpleCheck = ({value, setValue, text = '', className = ""}) => {
  return (
    <div className={"form-check " + className}>
      <input className="form-check-input" type="checkbox" id="flexCheckDefault"
             value={value} onClick={() => setValue(!value)}
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {text}
      </label>
    </div>
  );
}

export default SimpleCheck;
