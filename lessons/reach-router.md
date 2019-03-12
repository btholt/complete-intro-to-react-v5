---
order: 10
path: "/reach-router"
title: "Reach Router"
---

In previous versions of this course we used various iterations of the [React Router][rr]. React Router is a fantastic library and you should give serious consideration to using it in your project. Three of the previous versions of this workshop taught the still-current version of React Router, version 4. Feel free to check it out.

[Reach Router][reach] is a new router from one of the creators of React Router, [Ryan Florence][rf]. Ryan took much of his learnings from making React Router and made a simpler, more accessible, and easier to accomplish advanced tasks like animated transitions while still maintaining a similar API to React Router. Great piece of technology.

What we want to do now is to add a second page to our application: a Details page where you can out more about each animal.

Let's quickly make a second page so we can switch between the two. Make file called Details.js.

```javascript
import React from "react";

const Details = () => {
  return <h1>hi!</h1>;
};

export default Details;
```

Now the Results page is its own component. This makes it easy to bring in the router to be able to switch pages. Run `npm install @reach/router`.

Now we have two pages and the router available. Let's go make it ready to switch between the two.

```javascript
// at top
import { Router } from "@reach/router";
import Details from "./Details";

// replace <Results />
<Router>
  <SearchParams path="/" />
  <Details path="/details/:id" />
</Router>;
```

Now we have the router working! Try navigating to http://localhost:1234/ and then to http://localhost:1234/details/1. Both should work!

- Reach Router has a ton of features that we're not going to explain here. The docs do a great job.
- With Reach Router, you make your component the Route component (unlike React Router) by giving it a path attribute. Reach Router then will find the path that it most matches (it figures this out by a scoring algorithm the functions intuitively; this CSS selector.)
- The `:id` part is a variable. In `http://localhost:1234/details/1`, `1` would be the variable.
- The killer feature of Reach Router is that it's really accessible. It manages things like focus so you don't have to. Pretty great.

So now let's make the two pages link to each other. Go to Pet.js.

```javascript
// at top
import { Link } from "@reach/router";

// change wrapping <a>
<Link to={`/details/${id}`} className="pet">
  […]
</Link>;
```

Now each result is a link to a details page! And that id is being passed as a prop to Details. Try replacing the return of Details with `return <h1>{props.id}</h1>;`. You should see the number.

Let's make the Adopt Me! header clickable too.

```javascript
// import Link too
import { Router, Link } from "@reach/router";

// replace h1
<header>
  <Link to="/">Adopt Me!</Link>
</header>;
```

&nbsp;

## 🌳 [df2717245d61ab153c220d18c4d1bf858aee4311](https://github.com/btholt/complete-intro-to-react-v5/commit/df2717245d61ab153c220d18c4d1bf858aee4311)

&nbsp;

Now if you click the header, it'll take you back to the Results page. Cool. Now let's round out the Details page.

[rr]: https://reacttraining.com/react-router/
[rf]: https://twitter.com/ryanflorence
[reach]: https://github.com/reach/router
