import React, { useState } from "react";

const useDropdown = (label, defaultState, options) => {
  const [state, updateState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(" ", "").toLowerCase()}`;
  const Dropdown = () => (
    <label htmlFor={id}>
      {label}
      <select
        id={id}
        value={state}
        onChange={e => {
          updateState(e.target.value);
          if (e.target.value == "All") {
             updateState("");
          }
        }}
        onBlur={e => {
          updateState(e.target.value);
          if (e.target.value == "All") {
             updateState("");
          }
        }}
        disabled={!options.length}
      >
        <option />
        {options.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
  return [state, Dropdown, updateState];
};

export default useDropdown;
