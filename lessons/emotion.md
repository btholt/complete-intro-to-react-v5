---
title: "Emotion"
path: "/emotion"
order: 17
---

Emotion is a library for including your styles inside of your component files and allowing you to harness JavaScript to easily script your CSS. While previous CSS-in-JS solutions ballooned file sizes and were slow, Emotion is both small and fast. I'll show you how to get started with it; it merits its own course on all the cool and crazy things you can do with it.

First run `npm install @emotion/core @emotion/babel-preset-css-prop`

Make a new file called NavBar.js, put this in it:

```javascript
import React from "react";
import { Link } from "@reach/router";
import { css } from "@emotion/core";

const NavBar = () => (
  <header
    css={css`
      background-color: #333;
      position: sticky;
      top: 0;
      z-index: 10;
    `}
  >
    <Link to="/">Adopt Me!</Link>
    <span aria-label="logo" role="img">
      🐩
    </span>
  </header>
);

export default NavBar;
```

Add this to your `.babelrc`

```json
{
  "presets": [
    "@babel/preset-react",
    "@babel/preset-env",
    [
      "@emotion/babel-preset-css-prop",
      {
        "sourceMap": false
      }
    ]
  ],
  […]
}

```

Go to App.js and replace the `<header>` with `<NavBar />` after importing it at the top.

- Emotion has other ways of interacting with it (generating components) but here we're using the new `css` prop way of doing it. If you want to see the old way, see v4 of this course.
- The `css` prop allows us to use the `css` tagged template literal to write CSS. The Babel preset we added will then transpile that into code that Emotion can use and optimzie it, meaning your final code ends up being tiny.
- If you're not into using the `css` tagged template, you can use objects instead.
- We had to disable source maps for now because Parcel doesn't play nice with Emotion source maps. Webpack does. This will be fixed in Parcel 2.
- If you want to see highlighting of your CSS in Visual Studio Code, download the [styled-components][sc] extension. It works with Emotion too.

Make a new file called `colors.js`.

```javascript
export default {
  primary: "#bf3334",
  secondary: "#d9c148",
  dark: "#122622",
  light: "#81a69b",
  accent: "#122622"
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
<Link
  css={css`
    &:hover {
      text-decoration: underline;
    }
  `}
  to="/"
>
```

You can style other peoples' components too! Just pass the component into the styled function. You can also use `&` to represent the element in compound selectors like we've done here.

Lastly, let's make the dog spin!

```javascript
// import keyframes
import { css, keyframes } from "react-emotion";

// under other styled calls
const Spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// replace logo link
<span
  css={css`
    display: inline-block;
    animation: 1s ${Spin} linear infinite;
    font-size: 60px;
  `}
  aria-label="logo"
  role="img"
>
  🐩
</span>;
```

`keyframes` are how you do keyframes with Emotion. You create the keyframe, then use what it returns to reference inside your components, again making your keyframes tidily reusable.

That's it! That's most of what you need to know to use Emotion.

## 🌳 branch [emotion](https://github.com/btholt/complete-intro-to-react-v5/tree/emotion)

[sc]: https://marketplace.visualstudio.com/items?itemName=mf.vscode-styled-components&WT.mc_id=react-github-brholt
