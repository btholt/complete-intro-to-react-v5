import React, { useState, useEffect } from 'react';
import { ANIMALS } from '@frontendmasters/pet';

const SearchParamsPrac = () => {
    // const location = "Seattle, WA";
    // default state of Seattle
    // setLocation = updates the state (re-rendering)
    // getting your hook - array of current state and the update state function
    // no hooks inside if statements or for loops
    const [location, setLocation] = useState("Seattle, WA");
    const [animal, setAnimal] = useState("dog");

    return (
        <div className="search-params-prac">
            <form>
                <label htmlFor="location">
                    Location
                    <input 
                        id="location" 
                        value={location} 
                        placeholder="Location" 
                        onChange={e => setLocation(e.target.value)}
                    />
                </label>
                <label htmlFor="animal">
                    animal
                    <select 
                        id="animal" 
                        value={animal} 
                        placeholder="Animal" 
                        onChange={e => setAnimal(e.target.value)} 
                        onBlur={e => setAnimal(e.target.value)} >
                        <option>All</option>
                        {ANIMALS.map((animal) => (
                            <option key={animal} value={animal}>{animal}</option>
                        ))}
                    </select>
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default SearchParamsPrac;