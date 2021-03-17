import React from "react";

const Input = ({ obj, updateFunc }) => {
  return (
    <div className="input-group mb-2">
      <div className="col-3">
        <input
          onChange={(e) => {
            obj.key = e.target.value;
            updateFunc({ [obj._]: obj });
          }}
          value={obj.key}
          type="text"
          className="form-control"
          placeholder="Key"
          aria-label="Key"
          disabled={true}
        />
      </div>
      <div className="col-9 d-flex" style={{ paddingLeft: 5 }}>
        <input
          onChange={(e) => {
            obj.value = e.target.value;
            updateFunc({ [obj._]: obj });
          }}
          value={obj.value}
          type="text"
          className="form-control"
          placeholder={obj.placeHolder}
          aria-label={obj.placeHolder}
        />
      </div>
    </div>
  );
};

export default Input;
