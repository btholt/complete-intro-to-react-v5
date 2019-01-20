---
order: 9
title: "Forms with React"
path: "/forms"
---

Now we want to make it so you can modify what your search parameters are. Let's make a new route called SearchParams.js and have it accept these search parameters.

```javascript
import React from "react";

class Search extends React.Component {
  state = {
    location: "Seattle, WA",
    animal: "",
    breed: ""
  };
  render() {
    return (
      <div className="search-params">
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={this.state.location}
            placeholder="Location"
          />
        </label>
      </div>
    );
  }
}

export default Search;
```

Now add it to your routes:

```javascript
// in App.js, inside router
<SearchParams path="/search-params" />
```

Now navigate to http://localhost:1234/search-params and see that your have one input box that says "Seattle, WA". Try and type in it. You'll see that you can't modify it. Why? Let's think about how React works: when you type in the input, React detects that a DOM event happens. When that happens, React thinks _something_ may have changed so it runs a re-render. Providing your render functions are fast, this is a very quick operation. It then diffs what's currently there and what its render pass came up with. It then updates the minimum amount of DOM necessary.

Like className, `htmlFor` is used because `for` is a reserved word in JS.

So if we type in our input and it re-renders, what gets out in the `input` tag? Well, its value is tied to `this.state.location` and nothing changed that, so it remains the same. In other words, two way data binding is _not_ free in React. I say this is a feature because it makes you explicit on how you handle your data. Let's go make it work.

```javascript
// in Search.js

// between state and render
handleLocationChange = event => {
  this.setState({
    location: event.target.value
  });
};

// add to input
onChange={this.handleLocationChange}
```

Now it should work because any time the input changes, it updates the state. And now you can be assured that whatever is in the state is what's in the input.

Let's next make the animal drop down.

```javascript
// under handleLocationChange
handleAnimalChange = event => {
  this.setState({
    animal: event.target.value
  });
};

// under input
<label htmlFor="animal">
  Animal
  <select
    id="animal"
    value={this.state.animal}
    onChange={this.handleAnimalChange}
    onBlur={this.handleAnimalChange}
  >
    <option />
    {ANIMALS.map(animal => (
      <option key={animal} value={animal}>
        {animal}
      </option>
    ))}
  </select>
</label>;
```

Similar to above. We're using `onChange` and `onBlur` because it makes it more accessible.

Your ESLint is upset about the labels. This rule actually was deprecated and is about to be removed since _this_ usecase of it is actually correct.

In `.eslintrc.json`

```json
// in rules
"jsx-a11y/label-has-for": 0,
"no-console": 1
```

Now we want to populate the third dropdown, breed, based on the API. Every time animal changes, we need to request a new set of breeds. Let's do that. Also let's make it so console statements just warn.

```javascript
// replace handleAnimalChange
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

// beneath animal dropdown
<label htmlFor="breed">
  Breed
  <select
    disabled={!this.state.breeds.length}
    id="breed"
    value={this.state.breed}
    onChange={this.handleBreedChange}
    onBlur={this.handleBreedChange}
  >
    <option />
    {this.state.breeds.map(breed => (
      <option key={breed} value={breed}>
        {breed}
      </option>
    ))}
  </select>
</label>
<button>Submit</button>
```

We need to be reactive to every time animal changes to request new breeds. Whenever you call setState, it's not instant. React is smart enough to wait for you to make all your changes and then batch together re-renders into one go. So, because of that, if I do `this.setState({ number: this.state.number + 1}); console.log(this.state.number)`, that console.log will _probably_ be the previous number, before you called setState (it may not be either.) In either case, if you need to _guarantee_ that setState gets flushed, you can give setState an optional second param that it will call _after_ it finishes. Then we can guarantee getBreeds will work like we expect. Everything else is not new.

So now we have the data of what we want to search. How do we pass that into the Results page? Let me give you three options:

1. Move the state from living in SearchParams and into App. We can then pass that state from App into both SearchParams and Results. We then make functions that can modify that state and pass that into SearchParams that modify its parents state. This is a really common pattern but probably the least preferred options here. This can get hairy because your App component, as you may imagine in a large app, could end up holding _a lot_ of state.
1. Make everything a URL parameter and use Reach Router to maintain the state _in the URL_. This is probably the preferred option here. This makes it possible to deep link into searches in the Result page. This is what I'd normally do.
1. Because I want to show you how to use context, we're going to do that! Next lesson!

We'll make the button work in the next lesson.

&nbsp;

## 🌳 [0d4309ac626aa403cc96ccdec91acdfe50f62e49](https://github.com/btholt/complete-intro-to-react-v4/commit/0d4309ac626aa403cc96ccdec91acdfe50f62e49)
