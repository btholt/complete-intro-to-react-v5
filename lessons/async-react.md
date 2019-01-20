---
order: 8
title: "Handling Events and Async UIs with React"
path: "/async-and-events-in-react"
---

We need to handle asynchronous loading of data gracefully. We can't just show the user nothing until everything loads; we need to let them know we're doing work to get their UI ready. Let's see how to do that.

```javascript
// replace Details.js
import React from "react";
import pf from "petfinder-client";
import Carousel from "./Carousel";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }
  componentDidMount() {
    petfinder.pet
      .get({
        output: "full",
        id: this.props.id
      })
      .then(data => {
        let breed;
        if (Array.isArray(data.petfinder.pet.breeds.breed)) {
          breed = data.petfinder.pet.breeds.breed.join(", ");
        } else {
          breed = data.petfinder.pet.breeds.breed;
        }
        this.setState({
          name: data.petfinder.pet.name,
          animal: data.petfinder.pet.animal,
          location: `${data.petfinder.pet.contact.city}, ${
            data.petfinder.pet.contact.state
          }`,
          description: data.petfinder.pet.description,
          media: data.petfinder.pet.media,
          breed,
          loading: false
        });
      })
      .catch(err => this.setState({ error: err }));
  }
  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>;
    }

    const { animal, breed, location, description } = this.state;

    return (
      <div className="details">
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} — ${breed} — ${location}`}</h2>
          <p>{description}</p>
        </div>
      </div>
    );
  }
}

export default Details;
```

The constructor is getting annoying. We can use something called class properties to make it a lot nicer and easier to ready. Class properties are an upcoming part of JavaScript so we need to tell Parcel to include that code transformation when it transpiles our code. We do that by making a [Babel][babel] config file. Babel is the actual library that does the code transformation.

Since we're going to take ahold of our own Babel configuration, we need to take over _all of it_. Parcel won't do it for us anymore. So install the following:

```bash
npm install -D babel-eslint babel-core babel-preset-env babel-plugin-transform-class-properties
```

Now make a file called `.babelrc` with the following:

```json
{
  "presets": [
    "react",
    [
      "env",
      {
        "targets": {
          "browsers": ["last 2 versions"]
        }
      }
    ]
  ],
  "plugins": ["transform-class-properties"]
}
```

Babel's core concept is a plugin. Every one sort of a transformation it can perform is encapsulated into a plugin. Here we're including one explicitly: transform-class-properties. Then we're including a _preset_ as well. A preset is just a group of plugins, grouped together for convenience. `env` is a particularly good one you should expect to normally use. In this case, we've set up `env` to only target the last two major releases of the major browsers.

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

## 🌳 day-one

Loads easier to read, right? Feel free to replace the other constructors in the project if you want to.

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
    let photos = [];
    if (media && media.photos && media.photos.photo) {
      photos = media.photos.photo.filter(photo => photo["@size"] === "pn");
    }

    return { photos };
  }
  render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <img src={photos[active].value} alt="animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            <img
              key={photo.value}
              src={photo.value}
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
// first component inside div.details
<Carousel media={media} />
```

* getDerivedStateFromProps does exactly what it sounds like: it allows you to accept data from a parent and get state that is derived from it. In this case, we're removing the superfluous photos and just keeping the ones we want.

Let's make it so we can react to someone changing the photo on the carousel.

```javascript
import React from "react";

class Carousel extends React.Component {
  state = {
    photos: [],
    active: 0
  };
  static getDerivedStateFromProps({ media }) {
    let photos = [];
    if (media && media.photos && media.photos.photo) {
      photos = media.photos.photo.filter(photo => photo["@size"] === "pn");
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
        <img src={photos[active].value} alt="animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            /* eslint-disable-next-line */
            <img
              onClick={this.handleIndexClick}
              data-index={index}
              key={photo.value}
              src={photo.value}
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

* This is how you handle events in React. If it was keyboard handler, you'd do an onChange or onKeyUp, etc. handler.
* Notice that the handleIndexClick function is an arrow function. This is because we need the `this` in `handleIndexClick` to be the correct `this`. An arrow function assures that because it will be the scope of where it was defined.
* The data attribute comes back as a string. We want it to be a number, hence the `+`.
* We're doing bad accessibility stuff. But this makes it a lot simpler for now. But don't do this in production.

&nbsp;

## 🌳 [89678fe3f663be06f80e93370942592c03f3f5db](https://github.com/btholt/complete-intro-to-react-v4/commit/89678fe3f663be06f80e93370942592c03f3f5db)
