---
title: "Preact"
path: "/preact"
order: 20
---

[Preact][preact] is a marvel of engineering initially created by one man: [Jason Miller][jm]. Jason reimplemented React but only in 3KB (at the time, React was about 45KB.) He did so by making the browser do more work where React has its own systems that can be faster performance. Preact is ideal if you want your initial payload to be very low. If you're building a new project, consider using Preact.

Preact is _mostly_ a drop down replacement for React. There are some additional bells-and-whistles that React includes that Preact doesn't. For those additional features, Preact ships something called [preact-compat][pc] that fills in the rest of those blanks.

However, since Preact is _not_ created by the React team, there is a bit of lag between what's in React and when it finally makes it into Preact or preact-compat. Generally preact-compat exists to make it easy to port over React apps to Preact: it's not meant to be a permanent strategy.

So how we convert our app over to Preact? It _mostly_ works as is with a few exceptions. I'll give you a list of find-and-replaces that should get you all the way.

1. `npm uninstall react react-dom @reach/router`
1. `npm install preact preact-compat preact-context preact-router`
1. Find all instances of `"react"` and replace with `"preact-compat"`
1. Find all instances of `"react-dom"` and replace with `"preact-compat"`
1. Find all instances of `"@reach/router"` and replace with `"preact-router"`
1. Find all instances of the `<Link>` component being used and replace the `to` attribute with `href`
1. In SearchContext.js, replace React import with `import { createContext } from "preact-context";` and then remove the `React.` from `React.createContext`.
1. In SearchParams.js, renamed `navigate` to `route` in both the import and the call.
1. In Details.js, add a wrapping div _inside_ `<Modal>` around all the children.

This should get the app working as normal. As you can see, it's not always one-to-one. In our case, Reach Router isn't quite Preact compatible (it should be any day now, it may well be now if you're reading this later) which is why we swapped in preact-router. Context is coming to Preact as well so you won't need an external library either, and sometimes there are just additional quirks like createPortal requiring a wrapping div. Nonetheless, you can see we swapped in Preact and everything is working the same way at a decently quick pace!

As I said, this is a tool help you migrate. You should do this with the eye of getting of preact-compat and getting _just_ on Preact. This means reference Preact directly instead of React and using their way of doing things (which are different.) [See here][react-vs-preact] to see more.

Our final app went from 42KB to 15KB (minified and gzipped) so it's pretty effective too!

## 🌳 eb1c1600f4fead461e2a3f2d6668ac4ee734fcf5 (branch preact)

[preact]: https://preactjs.com/
[jm]: https://twitter.com/_developit
[pc]: https://github.com/developit/preact-compat
[react-vs-preact]: https://preactjs.com/guide/differences-to-react
