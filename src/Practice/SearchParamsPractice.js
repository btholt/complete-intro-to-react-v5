import React, { useState, useEffect, useContext } from 'react';
import pet, { ANIMALS } from '@frontendmasters/pet';
import Results from './ResultsPractice';
import useDropdownPrac from './useDropdownPractice';
import ThemeContextPrac from './ThemeContextPractice';

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
    const [pets, setPets] = useState([]);
    const [theme] = useContext(ThemeContextPrac);

    async function requestPets(){
        const { animals } = await pet.animals({
            location,
            breed,
            type: animal
        })
        setPets(animals || []);
    }

    // run once and never run again [] empty dependency array
    useEffect(() => {
        setBreeds([]);
        setBreed("");
        
        pet.breeds(animal).then(({ breeds: apiBreeds }) => {
            const breedStrings = apiBreeds.map(({name}) => name);
            setBreeds(breedStrings);
        }, console.error);
    }, [animal, setBreed, setBreeds]);


    return (
        <div className="search-params-prac">
            <form onSubmit={(e) => {
                e.preventDefault();
                requestPets();
            }}>
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
                <label htmlFor="theme">
                    Theme
                    <select
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        onBlur={e => setTheme(e.target.value)}
                    >
                        <option value="peru">Peru</option>
                        <option value="chartreuse">Chartreuse</option>
                        <option value="maroon">Maroon</option>
                        <option value="gainsboro">Gainsboro</option>
                    </select>
                </label>
                <button style={{ backgroundColor: theme }}>Submit</button>
            </form>
            <Results pets={pets} />
        </div>
    )
}

export default SearchParamsPrac;