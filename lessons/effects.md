---
order: 7
path: "/effects"
title: "Effects"
---

Back to React! Let's make our app be able to read live data about animals to adopt! This data is courteous of [Petfinder.com][petfinder], a wonderful service that provides a free API for adopting animals. Unfortunately, this service is USA-based, so please use USA locations only or else it won't return any results.

Please register [here][api] for an API key from Petfinder.

Create a file in the root of your project (same directory as package.json) that is called `.env`. Put this in there:

```
API_KEY=<Your API key>
API_SECRET=<Your API secret>
```

### ⚠️ IMPORTANT ⚠️

Whenever you add, remove, or change something from your .env file, you need to delete the .cache and dist directories (so that Parcel will do a clean build.) If later you're seeing you're getting unauthorized errors from the API, this is a likely culprit. If it helps, add this to your package.json and run it whenver you change your .env file before running `npm run dev` again.

If you see an error like this in your console, you're having this problem.

![Error saying that you're getting a syntax error due to "<"](./images/syntaxError.png)

```json
{
  "scripts": {
    "clear-build-cache": "rm -rf .cache/ dist/"
  }
}
```

Again, it's critical to clear your build cache first, _then_ stop and start your dev server when you modify your .env file. I'm emphasizing this a lot because a lot of people get tripped up here.

Now Parcel will read these variables out of your .env file and make them available inside of your app. Now you don't have to commit secrets to your codebase and that's _always_ a good thing. If someone gets access to GitHub for your code, they won't necessarily get your API keys. You'll use a different service like [Azure Key Vault][keyvault] or [Kubernetes Secrets][kube] to manage your secrets.

Now that your secrets are in there, let's install the Petfinder Client. I wrote this little wrapper for the API; it's not good. It's optimized for this use case only. Run `npm install petfinder-client`. In App.js, add:

```javascript
// at the top
import pf from "petfinder-client";

// under imports
const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

// inside render method, below useDropdown calls
useEffect(() => {
  petfinder.breed.list({ animal: "dog" }).then(console.log, console.error);
});
```

- pf takes in credentials and returns an API object. You only have to give it credentials here; anywhere else you import it it'll retain the same credentials. The API response has a silly and ridiculous structure.
- Here we're using an effect to retrieve a list of breeds from the API. An effect is run after every render (which happens after state changes.) You're going to use effects to do things like AJAX calls, modify ambient state, integrate with other libraries, and many other things. Basically it's a way to delay work until after render happens and to deal with asynchronous side effects.
- If you're familiar with previous versions of React, effects can take the place of _most_ life cycle methods. In this case we're going to use it instead of `componentDidMount` and `componentDidUpdate`.

So rather just having `dog` be the static animal, let's make that dynamic and let's make it actually save the breed it gets.

```javascript
// replace effect
useEffect(() => {
  petfinder.breed.list({ animal }).then(data => {
    updateBreeds(
      Array.isArray(data.petfinder.breeds.breed)
        ? data.petfinder.breeds.breed
        : [data.petfinder.breeds.breed]
    );
  }, console.error);
}, [animal]);
```

- Due to JavaScript closures (the fact that state is preserved for various render function calls) we're able to reference updateBreeds from the outer scope. We use this to update the breed after the successful call to the petfinder API.
- Petfinder API does weird stuff where it returns an array if there are more than one breed but just returns a string if there's only one. It's dumb.
- The array at the end is peculiar but essential. By default, effects will run at the end of every re-render. This is problematic for us because we're updating breeds, which causes a re-render, which causes another effect, which causes another re-render, etc. What you can to prevent this spiral is give it an array at the end of variables as a second parameter. Now this effect will only happen if one of those variables changes. In this case, it will only cause the effect if `animal` changes. Which is exactly what we want.
- Effects are always called after the first render no matter what.

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
- Add API keys to your `.env` file
- Run `npm run dev`.

&nbsp;

[petfinder]: https://www.petfinder.com/
[api]: https://www.petfinder.com/developers/api-key
[keyvault]: https://azure.microsoft.com/en-us/services/key-vault/?WT.mc_id=react-github-brholt
[kube]: https://kubernetes.io/docs/concepts/configuration/secret/
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
