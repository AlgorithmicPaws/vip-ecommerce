import React from 'react';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = 'text', 
  placeholder = '',
  maxLength = null,
  required = false
}) => {
  return (
    <div className="form-group">
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`form-input ${error ? 'error' : ''}`}
        required={required}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default FormField;