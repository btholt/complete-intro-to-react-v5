---
title: "Context"
path: "/context"
order: 13
---

Historically I have not taught context when teaching React. This was for a couple reasons. First of all, the API they were using was still unofficial, however they standardized it in version 16. Secondly, normally you don't need context; React's state is enough. Thirdly, the old API was bad, in my opinion. The new one is pretty good.

So here we go. What is context? Context is like state, but instead of being confined to a component, it's global to your application. It's application-level state. This is dangerous. Avoid using context until you _have_ to use it. One of React's primary benefit is it makes the flow of data obvious by being explicit. This can make it cumbersome at times but it's worth it because your code stays legible and understandable. Things like context obscure it.

Context (mostly) replaces Redux. Well, typically. It fills the same need as Redux. I really can't see why you would need to use both. Use one or the other.

Again, this is a contrived example. What we're doing here is overkill and should be accomplished via React's normal patterns. But let's check out what this looks like.

Imagine if we wanted to make the search box at the top of the page appear on the search-params page and the details page and re-use that component. And we want to make that state stick between the two. This means the state has to live outside of those routes. We could use Redux for it, we could use React itself, or we could use context.  Lets use context to teach you what that looks like.

Make a new file called ThemeContext.js

```javascript
import { createContext } from "react";

const ThemeContext = createContext(["green", () => {}]);

export default ThemeContext;
```

`createContext` is a function that returns an object with two React components in it: a Provider and a Consumer. A Provider is how you scope where a context goes. A context will only be available inside of the Provider. You only need to do this once.

A Consumer is how you consume from the above provider. A Consumer accepts a function as a child and gives it the context which you can use. We won't be using the Consumer directly: a function called `useContext` will do that for us.

The object provided to context is the default state it uses when it can find no Provider above it, useful if there's a chance no provider will be there and for testing. It's also useful for TypeScript because TypeScript will enforce these types. Here we're giving it the shape of a `useState` call because we'll be using `useState` with it. You do not have to use context with hooks; [see v4][v4] if you want to see how to do it without hooks. This example also has a more complicated data shape. This example is a lot more simple. If you wanted a more complicated data shape, you'd replace `"green"` with an object full of other properties.

Now we're going to make all the buttons' background color in the app be governed by the theme. First let's go to App.js

```javascript
// import useState and ThemeContext
import React, { useState } from "react";
import ThemeContext from "./ThemeContext";

// top of App function body
const theme = useState("darkblue");

// wrap the rest of the app
<ThemeContext.Provider value={theme}>
  […]
</ThemeContext.Provider>
```

- We're going to use the `useState` hook because theme is actually going to be kept track of like any other piece of state: it's not any different. You can think of context like a wormhole: whatever you chuck in one side of the wormhole is going to come out the other side.
- You have to wrap your app in a `Provider`. This is the mechanism by which React will notify the higher components to re-render whenever our context changes. Then whatever you pass into the value prop (we passed in the complete hook, the value and updater pair) will exit on the other side whenever we ask for it.
- Note that the theme will only be available _inside_ of this provider. So if we only wrapped the `<Details>` route with the Provider, that context would not be available inside of `<SearchParams />`.
- Side note: if your context is _read only_ (meaning it will _never change_) you actually can skip wrapping your app in a Provider.

Next let's go to `SearchParams.js`

```javascript
// import ThemeContext and useContext
import React, { useState, useEffect, useContext } from "react";
import ThemeContext from "./ThemeContext";

// top of SearchParams function body
const [theme] = useContext(ThemeContext);

// replace button
<button style={{ backgroundColor: theme }}>Submit</button>;
```

- Now your button should be a beautiful shade of `darkblue`.
- `useContext` is how you get the context data out of a given context (you can lots of various types of context in a given app.)
- Right now it's just reading from it and a pretty silly use of context. But let's go make Details.js use it as well.

Let's go do this in Details.js

```javascript
// import
import ThemeContext from "./ThemeContext";

// replace button
<ThemeContext.Consumer>
  {([theme]) => (
    <button style={{ backgroundColor: theme }}>Adopt {name}</button>
  )}
</ThemeContext.Consumer>;
```

- This is how you use context inside of a class component.
- Remember you cannot use hooks inside class components at all. This is why we're using the `Consumer` from `ThemeContext`. Functionally this works the same way though.

Lastly let's go make the theme change-able. Head back to SearchParams.js.

```javascript
// also grab setTheme
const [theme, setTheme] = useContext(ThemeContext);

// below BreedDropdown
<label htmlFor="location">
  Theme
  <select
    value={theme}
    onChange={e => setTheme(e.target.value)}
    onBlur={e => setTheme(e.target.value)}
  >
    <option value="darkblue">Dark Blue</option>
    <option value="peru">Peru</option>
    <option value="chartreuse">Chartreuse</option>
    <option value="mediumorchid">Medium Orchid</option>
  </select>
</label>;
```

- This looks relatively similar to hooks, right? I should because it works the same!
- Now try changing the theme and navigating to a pet page. Notice the theme is consistent! The theme is kept between pages because it's kept at the App level and App is never unmounted so its state persists between route changes.
- You can multiple layers of context. If I wrapped SearchParams in its own `Provider` (in addition to the one that already exists), the SearchParams context would read from that because it's the closet one whereas Details would read from the top level one because it's the only one.

That's it for context! Something like theming would be perfect for context. It's for app-level data. Everything else should be boring-ol' state.

&nbsp;

## 🌳 [355820d2455be23c1333465f965e523fd9aaae40](https://github.com/btholt/complete-intro-to-react-v5/commit/355820d2455be23c1333465f965e523fd9aaae40)

[v4]: https://btholt.github.io/complete-intro-to-react-v4/context
