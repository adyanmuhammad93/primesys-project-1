import React from "react";

const TextArea = ({
  gridWidth,
  label,
  placeholder,
  onChange,
  required,
  inputClass,
  value,
  errorMessage,
  disabled,
}) => {
  return (
    <>
      <div className={`form-control w-full ${gridWidth}`}>
        <label className="label">
          <span className="label-text">
            {label} {required && "*"}
          </span>
        </label>
        <textarea
          rows="1"
          placeholder={placeholder}
          className={`textarea textarea-bordered w-full ${inputClass}`}
          onChange={onChange}
          required={required}
          value={value}
          disabled={disabled}
        ></textarea>
        {errorMessage && (
          <label className="label">
            <span className="label-text-alt text-red-500">{errorMessage}</span>
          </label>
        )}
      </div>
    </>
  );
};

export default TextArea;
