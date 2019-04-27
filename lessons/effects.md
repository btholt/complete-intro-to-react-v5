---
order: 7
path: "/effects"
title: "Effects"
---

Back to React! Let's make our app be able to read live data about animals to adopt! This data is courteous of [Petfinder.com][petfinder], a wonderful service that provides a free API for adopting animals. Unfortunately, this service is USA-based, so please use USA locations only or else it won't return any results.

Since this Petfinder is a real service and we don't want to hammer their API, we've built a client that heavily caches responses and limits your location to only `Seattle, WA` and `San Francisco, CA`. If you request something else, it'll force you into one of these locations. We do this to cause less load on their servers. In the future this may change. Occasionally this API has gone down, so the API client can run in offline mode too. In order to run in offline mode, just make sure that `PET_MOCK=mock` is in your environmental variables. To accomplish, let's add this mock ability to your npm scripts. Run `npm install -D cross-env` and then add this to your package.json's scripts:

`"dev:mock": "cross-env PET_MOCK=mock npm run dev",`.

Now any time you run this `npm run dev:mock` instead of `npm run dev` you'll get mock data and not hit the API. This will work offline and if the API is down or taking too long.

Now let's go install the client. Run `npm install @frontendmasters/pet`.

In App.js:

```javascript
// at the top
import React, { useEffect } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";

// inside render method, below useDropdown calls
useEffect(() => {
  pet.breeds("dog").then(console.log, console.error);
});
```

- pf takes in credentials and returns an API object. You only have to give it credentials here; anywhere else you import it it'll retain the same credentials. The API response has a silly and ridiculous structure.
- Here we're using an effect to retrieve a list of breeds from the API. An effect is run after every render (which happens after state changes.) You're going to use effects to do things like AJAX calls, modify ambient state, integrate with other libraries, and many other things. Basically it's a way to delay work until after render happens and to deal with asynchronous side effects.
- If you're familiar with previous versions of React, effects can take the place of _most_ life cycle methods. In this case we're going to use it instead of `componentDidMount` and `componentDidUpdate`.

So rather just having `dog` be the static animal, let's make that dynamic and let's make it actually save the breed it gets.

```javascript
// replace effect
useEffect(() => {
  updateBreeds([]);
  updateBreed("");
  pet.breeds(animal).then(({ breeds }) => {
    const breedStrings = breeds.map(({ name }) => name);
    updateBreeds(breedStrings);
  }, console.error);
}, [animal]);
```

- Due to JavaScript closures (the fact that state is preserved for various render function calls) we're able to reference updateBreeds from the outer scope. We use this to update the breed after the successful call to the petfinder API.
- Petfinder API does weird stuff where it returns an array if there are more than one breed but just returns a string if there's only one. It's dumb.
- The array at the end is peculiar but essential. By default, effects will run at the end of every re-render. This is problematic for us because we're updating breeds, which causes a re-render, which causes another effect, which causes another re-render, etc. What you can to prevent this spiral is give it an array at the end of variables as a second parameter. Now this effect will only happen if one of those variables changes. In this case, it will only cause the effect if `animal` changes. Which is exactly what we want.
- Effects are always called after the first render no matter what.
- We have to pull the strings out of the objects from the API since the dropdown expect a list of strings, hence the map which does just that.

We want to console.error the messages if there's an error. Let's go turn that warning off in ESLint.

```json
{
  "rules": {
    …,
    "no-console": "warn"
  }
}
```

- It's useful to have ESLint bug you about taking console logs out but some times you do want them. Feel free to turn it off if it suits you.

Whenever a user selects a new animal, we need to programtically update the breed. Since we put this into a custom hook, we have no way to do that. Let's go make it do that. In useDropdown.js:

```javascript
// update return
return [state, Dropdown, updateState];
```

Now users can optionally programatically accept that function to update their components. Let's use this in the component. In SearchParams.js

```javascript
// replace BreedDropdown declaration
const [breed, BreedDropdown, updateBreed] = useDropdown("Breed", "", breeds);

// first line of the function inside useEffect
updateBreed("");
```

Now it updates the breed to empty whenever you change animal since you can't have a poodle cat (as cool as that sounds).

&nbsp;

## 🌳 [f702290c687a717356403dabd97658b3bbce7ad0](https://github.com/btholt/complete-intro-to-react-5/commit/f702290c687a717356403dabd97658b3bbce7ad0)

**To use reset code to this commit:**

- `git checkout f702290c687a717356403dabd97658b3bbce7ad0 -f`
- `npm install`
- Run `npm run dev`.

&nbsp;

[petfinder]: https://www.petfinder.com/
[api]: https://www.petfinder.com/developers/api-key
[keyvault]: https://azure.microsoft.com/en-us/services/key-vault/?WT.mc_id=react-github-brholt
[kube]: https://kubernetes.io/docs/concepts/configuration/secret/
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
