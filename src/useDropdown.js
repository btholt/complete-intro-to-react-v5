import React, { useState } from "react";

const useDropdown = (label, defaultState, options) => {
  const [state, updateState] = useState(defaultState);
  // if the replace pattern is a string only the first occurrence will be replaced
  // so to replace all use a regex with g flag
  const id = `use-dropdown-${label.replace(/ /g, "").toLowerCase()}`;
  const Dropdown = () => (
    <label htmlFor={id}>
      {label}
      <select
        id={id}
        value={state}
        onChange={e => updateState(e.target.value)}
        onBlur={e => updateState(e.target.value)}
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
