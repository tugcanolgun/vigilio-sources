import React from "react";

const Input = ({ obj, updateFunc }) => {
  return (
    <div className="input-group my-2">
      <div className="col-3">
        <input
          defaultValue={obj.key}
          type="text"
          disabled={true}
          className="form-control"
          placeholder={obj.key}
          aria-label={obj.key}
        />
      </div>
      <div
        className="col-9 d-flex align-items-center"
        style={{ paddingLeft: 5 }}
      >
        <input
          onChange={(e) => {
            obj.value = e.target.value;
            updateFunc({ [obj._]: obj });
          }}
          value={obj.value}
          type="text"
          className="form-control"
          placeholder="Value location"
          aria-label="Value location"
        />
      </div>
    </div>
  );
};

export default Input;
