---
path: "/jsx"
order: 5
title: "JSX"
---

So far we've been writing React without JSX, something that I don't know anyone that actually does in production. _Everyone_ uses JSX. I show you this way so what JSX is actually doing is demystified to you. It doesn't do hardly anything. It just makes your code a bit more readable.

If I write `React.createElement("h1", { id: "main-title" }, "My Website");`, what am I actually trying to have rendered out? `<h1 id="main-title">My Website</h1>`, right? What JSX tries to do is to shortcut this translation layer in your brain so you can just write what you mean. Let's convert Pet.js to using JSX. It will look like this:

```javascript
import React from "react";

const Pet = props => {
  return (
    <div>
      <h1>{props.name}</h1>
      <h2>{props.animal}</h2>
      <h2>{props.breed}</h2>
    </div>
  );
};

export default Pet;
```

I don't know about you, but I find this far more readable. And if it feels uncomfortable to you to introduce HTML into your JavaScript, I invite you to give it a shot until the end of the workshop. By then it should feel a bit more comfortable. And you can always go back to the old way.

However, now you know _what_ JSX is doing for you. It's just translating those HTML tags into `React.createElement` calls. _That's it._ Really. No more magic here. JSX does nothing else. Many people who learn React don't learn this.

Notice the strange `{props.name}` syntax: this is how you output JavaScript expressions in JSX. An expression is anything that can be the right side of an assignment operator in JavaScript, e.g. `const x = <anything that can go here>`. If you take away the `{}` it will literally output `props.name` to the DOM.

ESLint is currently failing. We'll fix it at the end.

Notice you still have to import React despite React not being explicitly used. Remember that JSX is compiled to `React.createElement` calls. Anywhere you use JSX, you need to import React.

So now JSX is demystified a bit, let's go convert App.js.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import Pet from "./Pet";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Adopt Me!</h1>
        <Pet name="Luna" animal="dog" breed="Havanese" />
        <Pet name="Pepper" animal="bird" breed="Cockatiel" />
        <Pet name="Doink" animal="cat" breed="Mix" />
      </div>
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

Notice we have Pet as a component. Notice that the `P` in `Pet` is capitalized. It _must_ be. If you make it lowercase, it will try to have `pet` as a web component and not a React component.

We now pass props down as we add attributes to an HTML tag. Pretty cool.

## ESLint + React

We need to give ESLint a hand to get it to recognize React and not yell about React not being used. Right now it thinks we're importing React and not using because it doesn't know what to do with React. Let's help it.

Run this: `npm install -D babel-eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`

Update your .eslintrc.json to:

```javascript
{
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "react/prop-types": 0
  },
  "plugins": ["react", "import", "jsx-a11y"],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  }
}
```

This is a little more complicated config than I used in previous versions of the workshop but this is what I use in my personal projects and what I'd recommend to you. In previous versions of this workshop, I used [airbnb][airbnb] and [standard][standard]. Feel free to check those out; I now find both of them a bit too prescriptive. Linting is a very opinionated subject, so feel free to explore what you like.

This particular configuration has a lot of rules to help you quickly catch common bugs but otherwise leaves you to write code how you want.

* The import plugin helps ESLint catch commons bugs around imports, exports, and modules in general
* jsx-a11y catches many bugs around accessibility that can accidentally arise using React, like not having an `alt` attribute on an `img` tag.
* react is mostly common React things, like making sure you import React anywhere you use React.
* babel-lint allows ESLint to use the same transpiling library, Babel, that Parcel uses under the hood. Without it, ESLint can't understand JSX.

&nbsp;

## 🌳 [f0d1d063ad52c47b2e30e27d524873f76fe6e71c](https://github.com/btholt/complete-intro-to-react-v4/commit/f0d1d063ad52c47b2e30e27d524873f76fe6e71c)

&nbsp;

[airbnb]: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
[standard]: https://standardjs.com/
