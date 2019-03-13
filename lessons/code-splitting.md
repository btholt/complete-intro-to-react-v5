---
title: "Code Splitting"
path: "/code-splitting"
order: 19
---

Code splitting is _essential_ to having small application sizes, particularly with React. React is already thirty-ish kilobytes just for the framework. This isn't huge but it's enough that it will slow down your initial page loads (by up to a second on 2G speeds.) If you have a lot third party libraries on top of that, you've sunk yourself before they've even started loading your page.

Enter code splitting. This allows us to identify spots where our code could be split and let Parcel do its magic in splitting things out to be loaded later. An easy place to do this would be at the route level. So let's try that first.

Previous versions of this course use `react-loadable` to accomplish this. The latest version of React uses a combination of two things to accomplish this: `Suspense` and `React.lazy`

Now add this to App.js

```javascript
// import from React
import React, { useState, lazy, Suspense } from "react";
// delete Details & Search params imports

// above const App =
const Details = lazy(() => import("./Details"));
const SearchParams = lazy(() => import("./SearchParams"));

// replace Router
<Suspense fallback={<h1>loading route …</h1>}>
  <Router>
    <SearchParams path="/" />
    <Details path="/details/:id" />
  </Router>
</Suspense>;
```

That's it! Now Parcel will handle the rest of the glueing together for you!! Your initial bundle will load, then after that it will resolve that you want to load another piece, show the loading component (we show a lame amount of text but this could be fancy loading screen.) This Details page isn't too big but imagine if it had libraries like Moment or Lodash on it! It could be a big savings.

Now our whole app loads async. What's great is that we can show the user _something_ (in this case just the header and the loading h1 but you should do better UX than that) and then load the rest of the content. You get to make your page fast.

One more trick. Let's go make the Modal code load async!

Refactor Details.js to be.

```javascript
// delete Modal import

// below imports
const Modal = lazy(() => import("./Modal"));
```

- That's it! Now we're not just splitting on route, we're splitting other places! You can split content _anywhere_! Load one component async while the other ones load sync. Use your imagination to achieve the best UX.
- This cut out like 1KB, but the point to understand here is you can split places other than routes. Anywhere you're not using code upfront you can split and load later.
- Notice we didn't have to use `<Suspense>` again. We already have a suspense component at the top of the app and so that still works!

## 🌳 branch [code-splitting](https://github.com/btholt/complete-intro-to-react-v5/tree/code-splitting)
