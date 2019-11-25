import React, { useState } from 'react';

const useDropDownPrac = (label, defaultState, options) => {
    const [state, useState] = useState(defaultState);
    const id = `use-dropdown-prac-${label.replace(" ", "").toLowerCase()}`;
    const DropdownPrac = () => {
        <label htmlFor={id}>
            {label}
            <select
                id={id}
                value={state}
                onChange={e => setState(e.target.value)}
                onBlur={e => setState(e.target.value)}
                disabled={options.length === 0}
                >
                <option>All</option>
                {options.map(item => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </label>
    };

    return [state, DropdownPrac, setState];
}

export default useDropDownPrac;