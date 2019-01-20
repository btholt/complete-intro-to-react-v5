---
title: "Code Splitting"
path: "/code-splitting"
order: 15
---

Code splitting is _essential_ to having small application sizes, particularly with React. React is already thirty-ish kilobytes just for the framework. This isn't huge but it's enough that it will slow down your initial page loads (by up to a second on 2G speeds.) If you have a lot third party libraries on top of that, you've sunk yourself before they've even started loading your page.

Enter code splitting. This allows us to identify spots where our code could be split and let Parcel do its magic in splitting things out to be loaded later. An easy place to do this would be at the route level. So let's try that first.

Run `npm install react-loadable`.

Now add this to App.js

```javascript
// delete Details import

// above App
const LoadableDetails = Loadable({
  loader: () => import("./Details"),
  loading() {
    return <h1>loading split code...</h1>;
  }
});

// replace Details
<LoadableDetails path="/details/:id" />;
```

That's it! Now Parcel will handle the rest of the glueing together for you!! Your initial bundle will load, then after that it will resolve that you want to load another piece, show the loading component (we show a lame amount of text but this could be fancy loading screen.) This Details page isn't too big but imagine if it had libraries like Moment or Lodash on it! It could be a big savings.

For fun let's go make the entire app load by Loadable

```javascript
// delete route imports

const loading = () => <h1>loading split code...</h1>;

const LoadableDetails = Loadable({
  loader: () => import("./Details"),
  loading
});

const LoadableSearchParams = Loadable({
  loader: () => import("./SearchParams"),
  loading
});

const LoadableResults = Loadable({
  loader: () => import("./Results"),
  loading
});

// replace routes
<LoadableResults path="/" />
<LoadableDetails path="/details/:id" />
<LoadableSearchParams path="/search-params" />
```

Now our whole app loads async. What's great is that we can show the user _something_ (in this case just the header but you should do better UX than that) and then load the rest of the content. You get to make your page fast.

One more trick. Let's go make the Modal content load async! Make a new file called AdoptModalContent.js.

```javascript
import React from "react";

const AdoptModalContent = props => (
  <React.Fragment>
    <h1>Would you like to adopt {props.name}?</h1>
    <div className="buttons">
      <button onClick={props.toggleModal}>Yes</button>
      <button onClick={props.toggleModal}>No</button>
    </div>
  </React.Fragment>
);

export default AdoptModalContent;
```

Refactor Details.js to be.

```javascript
// import
import Loadable from "react-loadable";

// above Details
const loading = () => <h1>loading split code...</h1>;

const LoadableContent = Loadable({
  loader: () => import("./AdoptModalContent"),
  loading
});

// replace the content of the modal
<LoadableContent toggleModal={this.toggleModal} name={name} />;
```

Now we're not just splitting on route, we're splitting other places! You can split content _anywhere_! Load one component async while the other ones load sync. Use your imagination to achieve the best UX.

## 🌳 7e2e8fe0b6bec9696757b2fb752998089e5d4e5a (branch code-splitting)
