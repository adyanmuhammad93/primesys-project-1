import React from "react";

const SelectOption = ({
  gridWidth,
  label,
  options,
  placeholder,
  onChange,
  required,
  inputClass,
  value,
}) => {
  return (
    <>
      <div className={`form-control w-full ${gridWidth}`}>
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <select
          className={`select select-bordered ${inputClass}`}
          onChange={onChange}
          required={required}
          value={value || ""}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SelectOption;
