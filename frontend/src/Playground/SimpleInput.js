import React from 'react';

const SimpleInput = ({value, setValue, placeholder = '', type = null, className = '', style = {}}) => {
  return (
    <input
      onChange={e => setValue(e.target.value)}
      value={value}
      type={type === null || type === undefined ? 'text' : type}
      className={'form-control ' + className}
      style={style}
      placeholder={placeholder}
      aria-label={placeholder}
    />

  );
}

export default SimpleInput;
