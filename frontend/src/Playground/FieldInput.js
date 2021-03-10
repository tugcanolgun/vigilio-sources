import React from "react";
import {TrashSvg} from "../svg";

const Input = ({obj, updateFunc, removeFunc}) => {
  return (
    <div className="input-group my-2">
      <div className="col-3">
        <input
          onChange={(e) => {
            obj.key = e.target.value;
            updateFunc({[obj._]: obj});
          }}
          value={obj.key}
          type="text"
          className="form-control"
          placeholder="Result field"
          aria-label="Result field"
        />
      </div>
      <div className="col-9 d-flex align-items-center" style={{paddingLeft: 5}}>
        <input
          onChange={(e) => {
            obj.value = e.target.value;
            updateFunc({[obj._]: obj});
          }}
          value={obj.value}
          type="text"
          className="form-control"
          placeholder="Value location"
          aria-label="Value location"
        />
        <a style={{cursor: 'pointer'}} onClick={() => removeFunc(obj._)}>
          <TrashSvg width={18} height={18} style={{color: '#8359b8'}}/>
        </a>
      </div>
    </div>
  );
};

export default Input;
