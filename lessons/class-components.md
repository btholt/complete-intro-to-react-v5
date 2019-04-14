---
order: 11
title: "Class Components"
path: "/class-components"
---

This class has been showing you the latest APIs for React: hooks. Going forward, I think these sorts of components will be the default way of writing React going forward. However, the class API still has its uses and isn't going anywhere anytime soon. In this section we're going to go through and learn the basics of it since there's still a lot class code out in the wild and the new API can't do _everything_ the old one can, so it's still useful in some cases.

Let's go make Details.js as a class.

```javascript
// replace Details.js
import React from "react";
import pet from "@frontendmasters/pet";

class Details extends React.Component {
  state = { loading: true };
  componentDidMount() {
    pet
      .animal(this.props.id)
      .then(({ animal }) => {
        this.setState({
          name: animal.name,
          animal: animal.type,
          location: `${animal.contact.address.city}, ${
            animal.contact.address.state
          }`,
          description: animal.description,
          media: animal.photos,
          breed: animal.breeds.primary,
          loading: false
        });
      })
      .catch(err => this.setState({ error: err }));
  }
  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>;
    }

    const { animal, breed, location, description, name } = this.state;

    return (
      <div className="details">
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} — ${breed} — ${location}`}</h2>
          <button>Adopt {name}</button>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
```

- Every class component extends `React.Component`. Every class component must have a render method that returns some sort of JSX / markup / call to `React.createElement`.
- Not every component needs to have a constructor. Many don't. I'll show you momentarily how you nearly never need to have one. In this case we need it to instantiate the state object (which we'll use instead of `useState`.) If you have a constructor, you _have_ to do the `super(props)` to make sure that the props are passed up to React so React can keep track of them.
- `componentDidMount` is a function that's called after the first rendering is completed. This pretty similar to a `useEffect` call that only calls the first time. This is typically where you want to do data fetching.
- Notice instead of getting props via parameters and state via `useState` we're getting it from the instance variables `this.state` and `this.props`. This is how it works with class components.

The constructor is annoying. We can use something called class properties to make it a lot nicer and easier to ready. Class properties are an upcoming part of JavaScript so we need to tell Parcel to include that code transformation when it transpiles our code. We do that by making a [Babel][babel] config file. Babel is the actual library that does the code transformation.

Since we're going to take ahold of our own Babel configuration, we need to take over _all of it_. Parcel won't do it for us anymore. So install the following:

```bash
npm install -D babel-eslint @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/preset-react
```

Now make a file called `.babelrc` with the following:

```json
{
  "presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

Babel's core concept is a plugin. Every one sort of a transformation it can perform is encapsulated into a plugin. Here we're including one explicitly: transform-class-properties. Then we're including a _preset_ as well. A preset is just a group of plugins, grouped together for convenience. `env` is a particularly good one you should expect to normally use.
This will allow us too to make ESLint play nice too (Prettier handles this automatically.) Add one line to the top level of your `.eslintrc.json`:

```json
{
  …
  "parser": "babel-eslint",
  …
}
```

Now with this, we can modify Details to be as so:

```javascript
// replace constructor
state = { loading: true };
```

Loads easier to read, right?

Okay, so on this page, notice first we have a loading indicator (this one isn't nice looking but you could put some effort into it if you wanted.) This is a good idea while you're waiting for data to load.

Let's make a nice photo carousel of the pictures for the animal now. Make a new file called Carousel.js

```javascript
import React from "react";

class Carousel extends React.Component {
  state = {
    photos: [],
    active: 0
  };
  static getDerivedStateFromProps({ media }) {
    let photos = ["http://placecorgi.com/600/600"];

    if (media.length) {
      photos = media.map(({ large }) => large);
    }

    return { photos };
  }
  handleIndexClick = event => {
    this.setState({
      active: +event.target.dataset.index
    });
  };
  render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <img src={photos[active]} alt="animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            // eslint-disable-next-line
            <img
              key={photo}
              onClick={this.handleIndexClick}
              data-index={index}
              src={photo}
              className={index === active ? "active" : ""}
              alt="animal thumbnail"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Carousel;
```

Add the Carousel component to the Detail page.

```javascript
// import at top
import Carousel from "./Carousel";

// first component inside div.details
<Carousel media={media} />;
```

- getDerivedStateFromProps does exactly what it sounds like: it allows you to accept data from a parent and get state that is derived from it. In this case, we're removing the superfluous photos and just keeping the ones we want.

Let's make it so we can react to someone changing the photo on the carousel.

```javascript
// add event listener
  handleIndexClick = event => {
    this.setState({
      active: +event.target.dataset.index
    });
  };

// above img
// eslint-disable-next-line

// add to img
onClick={this.handleIndexClick}
data-index={index}
```

- This is how you handle events in React class components. If it was keyboard handler, you'd do an onChange or onKeyUp, etc. handler.
- Notice that the handleIndexClick function is an arrow function. This is because we need the `this` in `handleIndexClick` to be the correct `this`. An arrow function assures that because it will be the scope of where it was defined. This is common with how to deal with event handlers with class components.
- The data attribute comes back as a string. We want it to be a number, hence the `+`.
- We're doing bad accessibility stuff. But this makes it a lot simpler for now. But don't do this in production.

&nbsp;

## 🌳 [905f25187febd31f100fb6d71487374bfa128530](https://github.com/btholt/complete-intro-to-react-v5/commit/905f25187febd31f100fb6d71487374bfa128530)
