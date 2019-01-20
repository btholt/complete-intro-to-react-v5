---
title: "Server Side Rendering"
path: "/server-side-rendering"
order: 17
---

Performance is a central concern for front end developers. We should always be striving to serve the leanest web apps that perform faster than humans can think. This is as much a game of psychology as it is a a technological challenge. It's a challenge of loading the correct content first so a user can see a site and begin to make a decision of what they want to do (scroll down, click a button, log in, etc.) and then be prepared for that action before they make that decision.

Enter server-side rendering. This is a technique where you run React on your Node.js server _before_ you serve the request to the user and send down the first rendering of your website already done. This saves precious milliseconds+ on your site because otherwise the user has to download the HTML, then download the JavaScript, then execute the JS to get the app. In this case, they'll just download the HTML and see the first rendered page while React is loading in the background.

While the total time to when the page is actually interactive is comparable, if a bit slower, the time to when the user _sees_ something for the first time should be much faster, hence why this is a popular technique. So let's give it a shot.

First, we need to remove all references to `window` or anything browser related from a path that _could_ be called in Node. That means whenever we reference `window`, it'll have to be inside componentDidMount since componentDidMount doesn't get called in Node.

We'll also have change where our app gets rendered. Make a new file called ClientApp.js. Put in there:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.hydrate(<App />, document.getElementById("root"));
```

This code will only get run in the browser, so any sort of browser related stuff can safely be done here (like analytics.) We're also using `React.hydrate` instead of `React.render` because this will hydrate existing markup with React magic ✨ rather than render it from scratch.

Because ClientApp.js will now be the entry point to the app, not App.js, we'll need to fix that in the script tag in index.html. Change it from App.js to ClientApp.js

Let's go fix App.js now:

```javascript
// remove react-dom import

// replace render at bottom
export default App;
```

The Modal makes reference to window in its modular scope, let's move that reference inside its componentDidMount:

```javascript
// delete modalRoot assignment

// in constructor
this.modalRoot = document.getElementById("modal");

// update references to modalRoot to this.modalRoot
```

Now Modal doesn't reference window in the modular scope but it _does_ in the constructor. This means you can't render a modal on initial page load. Since it's using the DOM to attach the portal, that sort of makes sense. Be careful of that.

With our `.babelrc` we don't currently have `babel-preset-react` installed (unless you're continuing on from the testing portion). Run `npm install -D babel-preset-react` and put `"react"` above the `"env"` array in your `.babelrc`.

We need a few more modules. Run `npm install babel-cli express` to get the tools we need for Node.

Now in your package.json, add the following to your `"scripts"`

```json
"build": "parcel build --public-url ./dist/ src/index.html",
"start": "npm -s run build && babel-node server/index.js"
```

This will allow us to build the app into static (pre-compiled, non-dev) assets and then start our server. babel-node will run Babel on our Node code so we can use our App JSX components without pre-compiling them. This works for dev but babel-cli isn't meant for prod. When you go to deploy your app, run Babel on your code to pre-compile it and then run the compiled JS.

Let's finally go write our Node.js server:

```javascript
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerLocation } from "@reach/router";
import fs from "fs";
import App from "../src/App";

const PORT = process.env.PORT || 3000;

const html = fs.readFileSync("dist/index.html").toString();

const parts = html.split("not rendered");

const app = express();

app.use("/dist", express.static("dist"));
app.use((req, res) => {
  const reactMarkup = (
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );

  res.send(`${parts[0]}${renderToString(reactMarkup)}${parts[1]}`);
  res.end();
});

console.log(`listening on ${PORT}`);
app.listen(PORT);
```

## Note: you may have to `npm install petfinder-client@0.0.2` if you're seeing errors around `export { ANIMALS }`. My bad.

* [Express.js][ex] is a Node.js web server framework. It's the most common one and a simple one to learn.
* We'll be listening on port 3000 (http://locahost:**3000**) unless a environment variable is passed in saying otherwise. We do this because if you try to deploy this, you'll need to watch for PORT.
* We'll statically serve what Parcel built.
* Anything that Parcel _doesn't_ serve, will be given our index.html. This lets the client-side app handle all the routing.
* We read the compiled HTML doc and split it around our `not rendered` statement. Then we can slot in our markup in between the divs, right where it should be.
* We use renderToString to take our app and render it to a string we can serve as HTML, sandwiched inside our outer HTML.

Run `npm run start` and then open http://localhost:3000 to see your server side rendered app. Notice it displays markup almost instantly.

## 🌳 0d4aed673883b49217cc298ad7a1393e9eb331e7 (branch ssr)

This is all cool, but we can make it _better_.

With HTTP requests, you can actually send responses in chunks. This is called _streaming_ your request. When you stream a request, you send partially rendered bits to your client so that the browser can immediately start processing the HTML rather than getting one big payload at the end. Really, the biggest win is that browser can immediately start downloading CSS while you're still rendering your app.

Let's see how to do this:

```javascript
// change react-dom import
import { renderToNodeStream } from "react-dom/server";

// replace app.use call
app.use((req, res) => {
  res.write(parts[0]);
  const reactMarkup = (
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );

  const stream = renderToNodeStream(reactMarkup);
  stream.pipe(res, { end: false });
  stream.on("end", () => {
    res.write(parts[1]);
    res.end();
  });
});
```

* Node has a native type called a stream. A stream, similar to a bash stream, is a stream of data that can be piped into something else. In this case, we have a Node stream of React markup being rendered. As each thing is rendered, React fires off a chunk that then can be sent to the user more quickly.
* First thing we do is _immediately_ write the head to the user. This way they can grab the `<head>` which the CSS `<link>` tag in it, meaning they can start the CSS download ASAP.
* From there we start streaming the React markup to the user.
* After we finish with that stream, we write the end of the index.html page and close the connection.

## 🌳 73f4e764a36490882b2129e0255f4501ffe2167b (branch ssr)

[ex]: http://expressjs.com/
