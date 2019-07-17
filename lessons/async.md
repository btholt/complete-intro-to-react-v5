---
order: 9
path: "/async"
title: "Handling Async"
---

We've seen one way to handle async code in React: with effects. This is most useful when you need to be reactive to your data changing or when you're setting up or tearing down a component. Some times you just need to respond to someone pressing a button. This isn't hard to accomplish either. Let's make whenever someone either hits enter or whenever someone clicks the button that it searches for animals. We can do this by listening for submit events on the form. Let's go do that now. In SearchParams.js

```javascript
// inside render
const [pets, setPets] = useState([]);

// below state declarations
async function requestPets() {
  const { animals } = await pet.animals({
    location,
    breed,
    type: animal
  });

  setPets(animals || []);
}

// replace <form>
<form
  onSubmit={e => {
    e.preventDefault();
    requestPets();
  }}
>
```

We don't want Parcel to use Babel to translate our async/await calls (since you and I are probably both using modern browsers, you'd want to let it translate it for production.) As such, add this to your package.json:

```json
{
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 ChromeAndroid versions",
    "last 2 Firefox versions",
    "last 2 FirefoxAndroid versions",
    "last 2 Safari versions",
    "last 2 iOS versions",
    "last 2 Edge versions",
    "last 2 Opera versions",
    "last 2 OperaMobile versions"
  ]
}
```

This will target all [evergreen browsers][evergreen]. If you're feeling lazy, feel free to just put the one in you're using.

Now you should be able to see the network request go out whenever you submit the form. Let's display it now. Make a new file called Results.js.

```javascript
import React from "react";
import Pet from "./Pet";

const Results = ({ pets }) => {
  return (
    <div className="search">
      {!pets.length ? (
        <h1>No Pets Found</h1>
      ) : (
        pets.map(pet => {
          return (
            <Pet
              animal={pet.type}
              key={pet.id}
              name={pet.name}
              breed={pet.breeds.primary}
              media={pet.photos}
              location={`${pet.contact.address.city}, ${
                pet.contact.address.state
              }`}
              id={pet.id}
            />
          );
        })
      )}
    </div>
  );
};

export default Results;
```

- `key` is there so that React knows when you re-arrange lists or filter them differently. It uses that key to shallowly compare if the item has changed or re-arragned to improve DOM performance. Use a unique identifier for it. Only use index if you have to.

Now go back to SearchParams.js and put this:

```javascript
// at top
import Results from "./Results";

// under </form>, still inside the div
<Results pets={pets} />;
```

Now you should be able to make request and see those propagated to the DOM! Pretty great!

Let's go make Pet.js look decent:

```javascript
import React from "react";

const Pet = props => {
  const { name, animal, breed, media, location, id } = props;

  let hero = "http://placecorgi.com/300/300";
  if (media.length) {
    hero = media[0].small;
  }

  return (
    <a href={`/details/${id}`} className="pet">
      <div className="image-container">
        <img src={hero} alt={name} />
      </div>
      <div className="info">
        <h1>{name}</h1>
        <h2>{`${animal} — ${breed} — ${location}`}</h2>
      </div>
    </a>
  );
};

export default Pet;
```

Looks much better! The links don't go anywhere yet but we'll get there. We don't have a good loading experience yet though. Right now we just seem unresponsive. Using a new tool to React called Suspense we can make the DOM rendering wait until we finish loading our data, show a loader, and then once it finishes we can resume rendering it. This is coming soon; for now you would just keep track of a loading Boolean and then conditionally show your component or a loading spinner based on whether it was finished loading or not.

&nbsp;

## 🌳 [9d521497c36a4733754efce41d7c277728ecda21](https://github.com/btholt/complete-intro-to-react-v5/commit/9d521497c36a4733754efce41d7c277728ecda21)

&nbsp;

[evergreen]: https://www.techopedia.com/definition/31094/evergreen-browser
