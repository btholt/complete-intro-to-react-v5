---
title: "Redux"
path: "/redux"
order: 19
---

Redux is a well-known library that does state management for you, very similarly to how we used context. With context, you use the provider and consumer as a sort of portal to skip passing parameters through every component. With Redux, we're taking the state management _out_ of React entirely and moving it to a separate store.

Why do we have Redux?

1. Context used to be a lot worse to use and less useful. This made Redux (or Redux-like) management tools the only option
1. Redux code is _extremely testable_. This is probably the most compelling reason to use it. Having your state mutation be broken up in such a way to make it easy to test is fantastic.
1. The debugging story is pretty good.

So given that we do now have the next context API, how often will I use Redux? Never, I anticipate. I rarely had problems that Redux solved (they exist; I just didn't have them) and the few cases now where I would see myself using Redux I think React's context would cover it. But if Redux speaks to you, do it! Don't let me stop you. It's a great library. Just be cautious. And there are reasons to use it: if you have complex orchestrations of async data, Redux can be immensely useful and I _would_ use it for that.

Okay, let's get started. React state management is pretty simple: call setState and let React re-render. That's it! Now there's a few steps involved.

1. User types in input box
1. Call action creator to get an action
1. Dispatch action to Redux
1. Redux inserts the action into the root reducer
1. The root reducer delegates that action to the correct reducer
1. The reducer returns a new state given the old state and the action object
1. That new state becomes the store's state
1. React is then called by Redux and told to update

So what was one step became several. But each step of this is testable, and that's great. And it's explicit and verbose. It's long to follow, but it's an easy breadcrumb trailer to follow when things go awry. So let's start writing it:

Run `npm install redux redux-thunk react-redux`. Create store.js and put in it:

```javascript
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    typeof window === "object" &&
      typeof window.devToolsExtension !== "undefined"
      ? window.devToolsExtension()
      : f => f
  )
);

export default store;
```

We're including the dev tools middleware (I'll show you at the end) as well as redux-thunk which we'll use in a second to do async actions. This is the base of a store: a reducer. A store is just basically a big object with prescribed ways of changing it. So let's go make our first reducer.

Make a new folder in src called `reducers.js`. In reducers.js, put:

```javascript
import { combineReducers } from "redux";
import location from "./location";

export default combineReducers({
  location
});
```

combineReducers is a convenience function from Redux so you don't have to write your own root reducer. You can if you want to; this is just a bit easier. So now we have a root reducer that will delegate all changed to the `location` key to this reducer. So let's go make it. Make a file called `location.js` and put in it:

```javascript
export default function location(state = "Seattle, WA", action) {
  switch (action.type) {
    case "CHANGE_LOCATION":
      return action.payload;
    default:
      return state;
  }
}
```

Not very difficult. A reducer takes an old state, an action, and combines those things to make a state. In this case, if the state is `San Francisco, CA` and some calls it with the action `{type: 'CHANGE_LOCATION': payload: 'Salt Lake City, UT' }` then the _new_ state location would be Salt Lake City, UT.

A reducer must have a default state. In our case, using ES6 default params, we made Seattle, WA our default state. This is how Redux will initialize your store, by calling each of your reducers once to get a default state.

The shape of the action object is up to you but there is a thing called [Flux Standard Action][fsa] that some people adhere to to make building tools on top of actions easier. I've not used any of those tools but I also don't have a good reason _not_ to use this shape so I do. In sum, make your action shapes be `{ type: <[String, Number], required>, payload: <any?>, error: <any?>, meta: <any?> }`. The type could in theory be a Symbol too but it messes up the dev tools.

Reducers are synchronous: they cannot be async. They also must be pure with no side-effects. If you call a reducer 10,000,000 times with the same state and action, you should get the same answer on the 10,000,001st time.

Okay, so now we understand how, once given a state and an action, we can make a reducer. We haven't made nor dispatched those actions yet but we're getting there. Let's make the other reducers.

animal.js

```javascript
export default function animal(state = "dog", action) {
  switch (action.type) {
    case "CHANGE_ANIMAL":
      return action.payload;
    default:
      return state;
  }
}
```

breeds.js

```javascript
export default function animal(state = [], action) {
  switch (action.type) {
    case "CHANGE_BREEDS":
      return action.payload;
    default:
      return state;
  }
}
```

breed.js

```javascript
export default function animal(state = "", action) {
  switch (action.type) {
    case "CHANGE_ANIMAL":
      return "";
    case "CHANGE_BREED":
      return action.payload;
    default:
      return state;
  }
}
```

In this last one, we also respond in breed.js to an animal change because that means the user switch animals and they can't search for a breed from a separate animal. This how you can have multiple cases and have one action trigger more than one reducer.

index.js

```javascript
import { combineReducers } from "redux";
import location from "./location";
import animal from "./animal";
import breed from "./breed";
import breeds from "./breeds";

export default combineReducers({
  location,
  animal,
  breed,
  breeds
});
```

Let's go make the action creators. These are the functions that the UI gives to the store to effect change: actions. These functions create actions.

Create a new folder called changeAnimal.js

```javascript
export default function changeAnimal(animal) {
  return { type: "CHANGE_ANIMAL", payload: animal };
}
```

That's it! This one is the simplest form: create an object and return it. Some people will inline these action shapes in their React components. I prefer this because it makes refactors simple. Let's make the other two:

changeLocation.js

```javascript
export default function changeLocation(location) {
  return { type: "CHANGE_LOCATION", payload: location };
}
```

changeBreed.js

```javascript
export default function changeBreed(breed) {
  return { type: "CHANGE_BREED", payload: breed };
}
```

That's it for action creators. Let's also show you how to do async actions. there are a thousand flavors of how to do async with Redux. The most popular are [redux-observable][ro], [redux-saga][rs], [redux-promise][rp], and [redux-thunk][rt]. We're going to use redux-thunk because it's simplest: the others are more powerful but more complex.

A thunk is a function. It's the representation of a value that has not been determined yet. It's an async value, similar to a promise. If I have

```javascript
const price = 1000;
const determinedLaterPrice = getPrice();
```

What is the value of `price`? 1000. This value was determined at write-time: when I wrote this code I knew the value of price. What is the value of `determinedLaterPrice`? We don't know! It'll be determined later. That's the gist of a thunk.

So with a thunk, we don't return an object, we return a function (the function returns a function) that will dispatch an action _later_. IT could still be sync, it could be async. Just not immediately. Keep in mind that reducers never see thunks: only sync action objects get dispatched to the store. These thunks just let us do AJAX before we dispatch an object. Make a new file called getBreeds.js:

```javascript
import pf from "petfinder-client";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

export default function getBreeds() {
  return function(dispatch, getState) {
    const { animal } = getState();
    petfinder.breed.list({ animal }).then(data => {
      let breeds = [];
      if (
        data.petfinder &&
        data.petfinder.breeds &&
        Array.isArray(data.petfinder.breeds.breed)
      ) {
        breeds = data.petfinder.breeds.breed;
      }
      dispatch({ type: "CHANGE_BREEDS", payload: breeds });
    });
  };
}
```

Notice our function returns a function, a thunk. We do our AJAX action and then only after we're done do we dispatch. That's a thunk. We also could dispatch _multiple_ actions, like if you wanted to show a loading indicator.

Okay, let's go integrate this now where context was being used before. Go to App.js:

```javascript
// delete pf

// import
import { Provider } from "react-redux";
import store from "./store";

// delete pf credentials loading

// delete constructor, handleBreedChange, handleAnimalChange, getBreeds, handleLocationChange

// wrap app with
<Provider store={store}>[…]</Provider>;
```

Feels nice deleting a lot of code, right?

Just like context makes your store available anywhere in your app, so does Provider.

Now that Redux is available everywhere, let's go add it to Results.js

```javascript
// replace Consumer import
import { connect } from "react-redux";

// replace context references
location: this.props.location,
animal: this.props.animal,
breed: this.props.breed,

// replace export
const mapStateToProps = ({ animal, breed, location }) => ({
  animal,
  breed,
  location
});

export default connect(mapStateToProps)(Results);
```

Connect is a little helper that will pluck things out of state and put them into your props for you so you can reference those as if they were normal state. This makes it not too hard to keep your Redux and React separate too so you can test both independently.

Let's go make SearchBox.js work:

```javascript
//replace Consumer import
import { connect } from "react-redux";
import getBreeds from "./actionCreators/getBreeds";
import changeLocation from "./actionCreators/changeLocation";
import changeAnimal from "./actionCreators/changeAnimal";
import changeBreed from "./actionCreators/changeBreed";

// delete Consumer wrapping component and function inside of it

// change every reference of `context.` to `this.props.` in render

// replace export
const mapStateToProps = ({ breed, breeds, animal, location }) => ({
  breed,
  breeds,
  location,
  animal
});

const mapDispatchToProps = dispatch => ({
  handleAnimalChange(event) {
    dispatch(changeAnimal(event.target.value));
    dispatch(getBreeds());
  },
  handleBreedChange(event) {
    dispatch(changeBreed(event.target.value));
  },
  handleLocationChange(event) {
    dispatch(changeLocation(event.target.value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
```

Now we're also using mapDispatchToState which lets us write functions to dispatch actions and thunks to Redux. Notice the first one we dispatch two. You could do this as a thunk too: either works.

Now it should work! Redux is a great piece of technology that adds a lot of complexity to your app. Don't add it lightly. I'd say you'd rarely want to start a new project using Redux: hit the problems first and then refactor it in. You just saw how.

Let's quickly try the dev tools:

- [Firefox][fox]
- [Chrome][chrome]

Download the one you're using, open up your app, and mess around the Redux tab. You can time travel, auto-generate tests, modify state, see actions, all sorts of cool stuff. Another good reason to use Redux.

Hopefully you're well informed on the boons and busts of introducing Redux. It's great, just be careful.

## 🌳 3f9ac730d9d6068ddd513c765ce1a92ba31407b4 (branch redux)

[fsa]: https://github.com/redux-utilities/flux-standard-action
[ro]: https://github.com/redux-observable/redux-observable
[rs]: https://redux-saga.js.org/
[rp]: https://docs.psb.codes/redux-promise-middleware/
[rt]: https://github.com/reduxjs/redux-thunk
[fox]: https://addons.mozilla.org/en-US/firefox/addon/remotedev/
[chrome]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
