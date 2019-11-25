import React from 'react';

const SearchParamsPrac = () => {
    const location = "Seattle, WA";

    return (
        <div className="search-params-prac">
            <form>
                <label htmlFor="location">
                    Location
                    <input 
                        id="location" 
                        value={location} 
                        placeholder="Location" 
                    />
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default SearchParamsPrac;