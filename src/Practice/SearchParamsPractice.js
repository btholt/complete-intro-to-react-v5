import React, { useState, useEffect } from 'react';
import pet, { ANIMALS } from '@frontendmasters/pet';
import useDropdownPrac from './useDropdownPractice';

const SearchParamsPrac = () => {
    // const location = "Seattle, WA";
    // default state of Seattle
    // setLocation = updates the state (re-rendering)
    // getting your hook - array of current state and the update state function
    // no hooks inside if statements or for loops
    const [location, setLocation] = useState("Seattle, WA");
    const [breeds, setBreeds] = useState([]);
    const [animal, AnimalDropdown] = useDropdownPrac("Animal", "dog", ANIMALS);
    const [breed, BreedDropdown] = useDropdownPrac("Breed", "", breeds);

    useEffect(() => {
        setBreeds([]);
        setBreed("");
        
        pet.breeds(animal).then(({ breeds }) => {
            const breedStrings = breeds.map(({name}) => name);
            setBreeds(breedStrings);
        }, console.error);
    });


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
                <AnimalDropdown />
                <BreedDropdown />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default SearchParamsPrac;