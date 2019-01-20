---
title: "Context"
path: "/context"
order: 10
---

Historically I have not taught context when teaching React. This was for a couple reasons. First of all, the API they were using was still unofficial, however they standardized it in version 16. Secondly, normally you don't need context; React's state is enough. Thirdly, the old API was bad, in my opinion. The new one is pretty good.

So here we go. What is context? Context is like state, but instead of being confined to a component, it's global to your application. It's application-level state. This is dangerous. Avoid using context until you _have_ to use it. One of React's primary benefit is it makes the flow of data obvious by being explicit. This can make it cumbersome at times but it's worth it because your code stays legible and understandable. Things like context obscure it.

Context replaces Redux. Well, typically. It fills the same need as Redux. I really can't see why you would need to use both. Use one or the other.

Again, this is a contrived example. What we're doing here is overkill and should be accomplished via React's normal patterns. But let's check out what this looks like.

Image if we wanted to make the search box at the top of the page appear on the search-params page and the results page and re-use that component. And we want to make that state stick between the two. This means the state has live outside of those routes. We could use Redux for it, we could React itself, or we're going to use context, to teach you what that looks like.

Make a new file called SearchContext.js

```javascript
import React from "react";

const SearchContext = React.createContext({
  location: "Seattle, WA",
  animal: "",
  breed: "",
  breeds: [],
  handleAnimalChange() {},
  handleBreedChange() {},
  handleLocationChange() {},
  getBreeds() {}
});

export const Provider = SearchContext.Provider;
export const Consumer = SearchContext.Consumer;
```

`createContext` is a function that returns an object with two React components in it: a Provider and a Consumer. A Provider is how you scope where a context goes. A context will only be available inside of the Provider. You only need to do this once.

A Consumer is how you consume from the above provider. A Consumer accepts a function as a child and gives it the context which you can use.

The object provided to context is the default state it uses when it can find no Provider above it, useful if there's a chance no provider will be there and for testing. Here we're giving it a bunch of default values.

Let's move all the data management into App from SearchParams.

```javascript
// import
import pf from "petfinder-client";
import { Provider } from "./SearchContext";

// below imports
const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

constructor(props) {
  super(props);

  this.state = {
    location: "Seattle, WA",
    animal: "",
    breed: "",
    breeds: [],
    handleAnimalChange: this.handleAnimalChange,
    handleBreedChange: this.handleBreedChange,
    handleLocationChange: this.handleLocationChange,
    getBreeds: this.getBreeds
  };
}
handleLocationChange = event => {
  this.setState({
    location: event.target.value
  });
};
handleAnimalChange = event => {
  this.setState(
    {
      animal: event.target.value
    },
    this.getBreeds
  );
};
handleBreedChange = event => {
  this.setState({
    breed: event.target.value
  });
};
getBreeds() {
  if (this.state.animal) {
    petfinder.breed
      .list({ animal: this.state.animal })
      .then(data => {
        if (
          data.petfinder &&
          data.petfinder.breeds &&
          Array.isArray(data.petfinder.breeds.breed)
        ) {
          this.setState({
            breeds: data.petfinder.breeds.breed
          });
        } else {
          this.setState({ breeds: [] });
        }
      })
      .catch(console.error);
  } else {
    this.setState({
      breeds: []
    });
  }
}

// wrap the router
<Provider value={this.state}>
  […]
</Provider>
```

Now move all the markup from SearchParams.js into a new SearchBox.js

```javascript
import React from "react";
import { ANIMALS } from "petfinder-client";
import { Consumer } from "./SearchContext";

class Search extends React.Component {
  render() {
    return (
      <Consumer>
        {context => (
          <div className="search-params">
            <label htmlFor="location">
              Location
              <input
                id="location"
                onChange={context.handleLocationChange}
                value={context.location}
                placeholder="Location"
              />
            </label>
            <label htmlFor="animal">
              Animal
              <select
                id="animal"
                value={context.animal}
                onChange={context.handleAnimalChange}
                onBlur={context.handleAnimalChange}
              >
                <option />
                {ANIMALS.map(animal => (
                  <option key={animal} value={animal}>
                    {animal}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="breed">
              Breed
              <select
                disabled={!context.breeds.length}
                id="breed"
                value={context.breed}
                onChange={context.handleBreedChange}
                onBlur={context.handleBreedChange}
              >
                <option />
                {context.breeds.map(breed => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </label>
            <button>Submit</button>
          </div>
        )}
      </Consumer>
    );
  }
}

export default Search;
```

SearchParams.js now looks like this:

```javascript
import React from "react";
import SearchBox from "./SearchBox";

class Search extends React.Component {
  render() {
    return (
      <div className="search-route">
        <SearchBox />
      </div>
    );
  }
}

export default Search;
```

Now in Results.js, just add:

```javascript
// first thing inside .search
<SearchBox />
```

Now `/search-params` and `/` will both work with context!

Here's the commit with context (which we'll keep working with):

## With Context: 🌳 [c0da3625726882dabc28255a3527f0170f31a9d7](https://github.com/btholt/complete-intro-to-react-v4/commit/c0da3625726882dabc28255a3527f0170f31a9d7)

&nbsp;

In a real-world situation, using context for this situation is probably overkill. If you'd like to see what this looks like without using context, [check out this pull request][pr]. Here's the commit if you're interested:

## Without Context: 🌳 [c8a83bd4adb5dfc92615cbce194fda3afb56c7cc](https://github.com/btholt/complete-intro-to-react-v4/commit/c8a83bd4adb5dfc92615cbce194fda3afb56c7cc) (branch: without-context)

&nbsp;

Now let's go make the Results read from the Consumer as well.

```javascript
// at the top
import { Consumer } from "./SearchContext";

// replace componentDidMount
componentDidMount() {
  this.search();
}
search = () => {
  petfinder.pet
    .find({
      location: this.props.searchParams.location,
      animal: this.props.searchParams.animal,
      breed: this.props.searchParams.breed,
      output: "full"
    })
    .then(data => {
      let pets;
      if (data.petfinder.pets && data.petfinder.pets.pet) {
        if (Array.isArray(data.petfinder.pets.pet)) {
          pets = data.petfinder.pets.pet;
        } else {
          pets = [data.petfinder.pets.pet];
        }
      } else {
        pets = [];
      }
      this.setState({
        pets: pets
      });
    });
};

// add prop to SearchBox
<SearchBox search={this.search} />

// add consumer to export
export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {context => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
```

That's it! Let's look at what we did

* We now need to search more frequently just on load. So with that we move search to a function and just call that on componentDidMount
* We'll pass that search function as a callback to SearchBox so we can call it from within SearchBox
* We need to access context within our life cycle method, so that means we'll just wrap Results itself with a context consumer and then pass that context into Results as a prop!

Let's go add search into SearchBox.

```javascript
<button onClick={this.props.search}>Submit</button>
```

That's it! Now your Results page should work! Let's go make the other page work too. First, let's add a link to the header to SearchParams. Add this to App.js

```javascript
// beneath the other Link
<Link to="/search-params">
  <span aria-label="search" role="img">
    🔍
  </span>
</Link>
```

Next let's go SearchParams and make the last bit work.

```javascript
// import
import { navigate } from "@reach/router";

// above render, inside Search
search() {
  navigate("/");
}

// add prop
<SearchBox search={this.search} />
```

* Now the SearchParams works too, reading data from one route and using it in another. Again, this is overkill and not necessarily a good use of context, but it's good illustrate how it would work.
* We use navigate from Reach Router. This lets us programmatically redirect to the Results page.

&nbsp;

## 🌳 [9311c6076a41f350b9ad45f9bfa8528c1a8b81d0](https://github.com/btholt/complete-intro-to-react-v4/commit/9311c6076a41f350b9ad45f9bfa8528c1a8b81d0)

&nbsp;

[pr]: https://github.com/btholt/complete-intro-to-react-v4/pull/1
