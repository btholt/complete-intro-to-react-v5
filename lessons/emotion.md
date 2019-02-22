---
title: "Emotion"
path: "/emotion"
order: 16
---

Emotion is a library for including your styles inside of your component files and allowing you to harness JavaScript to easily script your CSS. While previous CSS-in-JS solutions ballooned file sizes and were slow, Emotion is both small and fast. I'll show you how to get started with it; it merits its own course on all the cool and crazy things you can do with it.

First run `npm install emotion react-emotion`.

Make a new file called NavBar.js, put this in it:

```javascript
import React from "react";
import { Link } from "@reach/router";
import styled from "react-emotion";

const Container = styled("header")`
  background-color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NavBar = () => (
  <Container>
    <Link to="/">Adopt Me!</Link>
    <Link to="/search-params">
      <span aria-label="search" role="img">
        🔍
      </span>
    </Link>
  </Container>
);

export default NavBar;
```

Go to App.js and replace the `<header>` with `<NavBar />` after importing it at the top.

So here we're using Emotion to generate React components that are styled the way we choose. Here we've made a sticky header at the top. This is 95% how you'll use Emotion: making components and then using them. But let's see some more reasons why to use them.

Make a new file called `colors.js`.

```javascript
export default {
  primary: "#ad343e",
  secondary: "#f2af29",
  dark: "#333",
  light: "#000"
};
```

Now import that into NavBar.js

```javascript
// import
import colors from "./colors";

// replace background-color
background-color: ${colors.dark};
```

This allows for super simple variable sharing that ends up being scoped instead of sometimes-unruly CSS variables.

Now what if we wanted to make our links underline on hover?

```javascript
const NavLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;
```

You can style other peoples' components too! Just pass the component into the styled function. You can also use `&` to represent the element in compound selectors like we've done here.

Lastly, let's make the spy glass spin!

```javascript
// import keyframes
import styled, { keyframes } from "react-emotion";

// under other styled calls
const Spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpyGlass = styled("span")`
  display: inline-block;
  animation: 1s ${Spin} linear infinite;
`;

// replace span
{
  /* eslint-disable-next-line */
}
<SpyGlass aria-label="search" role="img">
  🔍
</SpyGlass>;
```

keyframes are how you do keyframes with Emotion. You create the keyframe, then use what it returns to reference inside your components, again making your keyframes tidily reusable. From there we use the keyframe, disable the a11y warning we get from ESLint (since it is still a span and ESLint just can't see it) and then render out the results (still with the correct attributes since Emotion just passes them on.)

That's it! That's most of what you need to know to use Emotion.

## 🌳 8d406c43fe1c096fe7b1b8d93aab0322dc66607b (branch emotion)
