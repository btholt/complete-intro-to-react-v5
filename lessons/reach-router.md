---
order: 7
path: "/reach-router"
title: "Reach Router"
---

In previous versions of this course we used various iterations of the [React Router][rr]. React Router is a fantastic library and you should give serious consideration to using it in your project. As of writing, the last version of this workshop taught the still-current version of React Router, version 4. Feel free to check it out.

[Reach Router][reach] is a new router from one of the creators of React Router, [Ryan Florence][rf]. Ryan took much of his learnings from making React Router and made a simpler, more accessible, and easier to accomplish advanced tasks like animated transitions while still maintaining a similar API to React Router. Great piece of technology.

What we want to do now is to add a second page to our application: a Details page where you can out more about each animal.

First, let's split what we out of App and into a Results page so we can then have _two_ pages.

```javascript
// Results.js
import React from "react";
import pf from "petfinder-client";
import Pet from "./Pet";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: []
    };
  }
  componentDidMount() {
    petfinder.pet
      .find({ location: "Seattle, WA", output: "full" })
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
  }
  render() {
    return (
      <div className="search">
        {this.state.pets.map(pet => {
          let breed;
          if (Array.isArray(pet.breeds.breed)) {
            breed = pet.breeds.breed.join(", ");
          } else {
            breed = pet.breeds.breed;
          }
          return (
            <Pet
              animal={pet.animal}
              key={pet.id}
              name={pet.name}
              breed={breed}
              media={pet.media}
              location={`${pet.contact.city}, ${pet.contact.state}`}
            />
          );
        })}
      </div>
    );
  }
}

export default Results;
```

then

```javascript
import React from "react";
import ReactDOM from "react-dom";
import Results from "./Results";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Adopt Me!</h1>
        <Results />
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

Let's quickly make a second page so we can switch between the two. Make file called Details.js.

```javascript
import React from "react";

class Details extends React.Component {
  render() {
    return <h1>hi!</h1>;
  }
}

export default Details;
```

Now the Results page is its own component. This makes it easy to bring in the router to be able to switch pages. Run `npm install @reach/router`.

Now we have two pages and the router available. Let's go make it ready to switch between the two.

```javascript
// at top
import { Router } from "@reach/router";
import Details from "./Details";

// replace <Results />
<Router>
  <Results path="/" />
  <Details path="/details/:id" />
</Router>;
```

Now we have the router working! Try navigating to http://localhost:1234/ and then to http://localhost:1234/details/1. Both should work!

* Reach Router has a ton of features that we're not going to explain here. The docs do a great job.
* With Reach Router, you make your component the Route component (unlike React Router) by giving it a path attribute. Reach Router then will find the path that it most matches (it figures this out by a scoring algorithm the functions intuitively; this CSS selector.)
* The `:id` part is a variable. In `http://localhost:1234/details/1`, `1` would be the variable.
* The killer feature of Reach Router is that it's really accessible. It manages things like focus so you don't have to. Pretty great.

So now let's make the two pages link to each other. Go to Pet.js.

```javascript
// at top
import { Link } from "@reach/router";

// change wrapping div
<Link to={`/details/${id}`} className="pet">
  […]
</Link>;
```

Go to Results and pass in the id.

```javascript
id={pet.id}
```

Now each result is a link to a details page! And that id is being passed as a prop to Details. Try replacing the return of Details with `return <h1>{this.props.id}</h1>;`. You should see the number.

Let's make the Adopt Me! header clickable too.

```javascript
// import Link too
import { Router, Link } from "@reach/router";

// replace h1
<header>
  <Link to="/">Adopt Me!</Link>
</header>;
```

## 🌳 [89678fe3f663be06f80e93370942592c03f3f5db](https://github.com/btholt/complete-intro-to-react-v4/commit/89678fe3f663be06f80e93370942592c03f3f5db)

Now if you click the header, it'll take you back to the Results page. Cool. Now let's round out the Details page.

[rr]: https://reacttraining.com/react-router/
[rf]: https://twitter.com/ryanflorence
[reach]: https://github.com/reach/router
