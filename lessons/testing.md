---
title: "Testing"
path: "/testing"
order: 22
---

_Note: This is where the Intermediate React course starts. All lessons from 15-22 on out are self-contained and always start from the [master branch](https://github.com/btholt/complete-intro-to-react-v5) of the git repository._

**To get reset to the latest code:**

- `git clone git@github.com:btholt/complete-intro-to-react-v5.git`
- `git checkout master -f`
- Make sure you have [Node.js installed](https://nodejs.org).
- `npm install`
- `npm run dev` to start the server on http://localhost:1234/

This is meant to be a very brief treatise on how to do testing on React applications. Frontend Masters already has a [thorough course on how to test React applications][kcd] here from Kent C. Dodds. This will be a brief intro on how to set up Jest tests for the application we just created.

## Testing with Jest

First we'll start with [Jest][jest]. Jest is the testing framework that Facebook puts out. It is not at all tied to React despite both being maintained by Facebook. It's useful for other frameworks and I use it frequently with Node.js applications.

It's useful to know that Jest is built on top of [Jasmine][jasmine]. Jasmine does the underlying testing part while Jest is the highlevel runner of the tests. Sometimes it's useful to consult the Jasmine docs too.

So let's start testing our application. Run `npm install -D jest react-testing-library`.

`react-testing-library` is made by another Frontend Masters teacher, [Kent C. Dodds][kcd]. This tool has a bunch of convenience features that make testing React significantly easier and is now the recommended way of testing React, supplanting [Enzyme][enzyme]. Previous versions of this course teach Enzyme if you'd like to see that.

Next go into your src directory and create a folder called `__tests__`. Notice that's double underscores on both sides. Why double? They borrowed it from Python where double underscores ("dunders" as I've heard them called) mean something magic happens. In this case, Jest assumes all JS files in here are tests.

We're going to write tests for SearchParams. But remember that SearchParmas use `@frontendmasters/pet` to make API requests, something we can't do in Node.js. Luckily we can make a mock of it. In the root directly of the project, create a folder called `__mocks__`. If a put a file in here called `lodash.js`, that file will be imported anywhere I have `import _ from "lodash"`. It's so we can mock modules (like `@frontendmasters/pet`) that wouldn't make sense to run in Node or for your tests. So create the folder, create a folder inside that called `@frontendmasters` (to signify the scoped package's organization) and then put `pet.js` inside of that.

```javascript
import { readFileSync } from "fs";
import path from "path";
import { act } from "react-testing-library";

const breeds = [
  "Bichon Frise",
  "Bolognese",
  "Bolonka",
  "Coton de Tulear",
  "Havanese",
  "Lowchen",
  "Maltese"
];

const doggos = JSON.parse(
  readFileSync(path.join(__dirname, "/res.json")).toString()
);

export const ANIMALS = ["dog", "cat", "bird"];
export const _breeds = breeds;
export const _dogs = doggos.animals;

const mock = {
  breeds: jest.fn(() => {
    return {
      then: callback =>
        act(() => {
          callback({
            breeds
          });
        })
    };
  }),
  animals: jest.fn(() => {
    return {
      then: callback =>
        act(() => {
          callback(doggos);
        })
    };
  })
};

export default mock;
```

After that, [go copy and paste this fixture][res] into your same directory as the mock `pet.js` and call it `res.json`.

- I just literally looked at one of the responses from Petfinder and took out the identifiying information.
- Here we're having to do a few odd things. The first you'll notice we're mimicking the API of the `pet` client. We're exporting an `ANIMALS` variable and a default object which has `breeds` and `animals` methods.
- These are in turn returning fake promises. We're doing this so we can wrap these actions in `act` calls from `react-testing-library` (that method actually originates from `react-test-renderer`, the underlying `react-dom`-like library made for testing.) `act` allows React to correctly batch updates to better simulate the browser. If you don't do this, the behavior can be non-deterministic (which means if you run it twice you make get two different results) and cause flaky tests. It has the added benefit of being synchronous and faster.
- We're also exporting the breeds and dogs objects which are the underlying data structures. This is because we want to compare that if we return five breeds from the API, that we have five options inside the dropdown.
- We're using `jest.fn` so we can spy on these functions later to make sure that the app is calling the API on startup.

Now make a file called SearchParams.test.js. In there put:

```javascript
import React from "react";
import { render, cleanup } from "react-testing-library";
import pet, { _breeds, _dogs, ANIMALS } from "@frontendmasters/pet";
import SearchParams from "../SearchParams";

afterEach(cleanup);

test("SearchParams", async () => {
  const { getByTestId } = render(<SearchParams />);

  const animalDropdown = getByTestId("use-dropdown-animal");
  expect(animalDropdown.children.length).toEqual(ANIMALS.length + 1);
});
```

Now in `useDropdown.js` put this so we can grab the correct select:

```javascript
 <select
  data-testid={id}
  […]
>
```

- Using test-ids is a good idea because you're divorcing test logic from typical app logic, hence why we don't use a normal ID. If your structure changes, you just move the testid to be somewhere else and it continues working.
- `react-testing-library` has its own cleanup to do so we pass that function to Jest to let it do it.
- Next we use render to render out all the SearchParams in a testing vacuum to JS representation of the JS markup. From there we check that it populates the animal dropdown with the correct number of animals (the +1 is there because there's an empty option too.)

Run this test via `npx jest`. If you seeit work, then place `"test": "jest"` in your package.json's scripts.

`test` and `expect` come from Jasmine via Jest and are injected in the global scope. To fix your lint errors, add this your `env` in your .eslintrc.json: `"jest": true`.

Let's add another test.

```javascript
// beneat the last expect
expect(pet.breeds).toHaveBeenCalled();
const breedDropdown = getByTestId("use-dropdown-breed");
expect(breedDropdown.children.length).toEqual(_breeds.length + 1);
```

- We're using `toHaveBeenCalled` to check on the spied methods to make sure the app is calling the API correctly. You can get really granular with what params but we'll skip that for now.
- Because we made the "promises" synchronous, we don't have to do any waiting for the first breed list. `react-testing-library` has tools that let you wait for DOM changes.

Let's get a bit more complicated. Add this:

```javascript
// pull out more things from render
const { container, getByTestId, getByText } = render(<SearchParams />);

// beneath the last test
const searchResults = getByTestId("search-results");
expect(searchResults.textContent).toEqual("No Pets Found");
fireEvent(getByText("Submit"), new MouseEvent("click"));
expect(pet.animals).toHaveBeenCalled();
expect(searchResults.children.length).toEqual(_dogs.length);
```

We have a bit of a problem though. Jest expects to be to run this tests synchronously and we're doing async await. We can't force JS into doing this sync. If wanted to this this way, we either have to monkey patch promises in the testing environment (gross, but this is how Facebook does it) or we can refactor to not use async await. This is simpler for our learning purporses, so let's do that. In SearchParams.js

```javascript
// refactor requestPets
function requestPets() {
  pet
    .animals({
      location,
      breed,
      type: animal
    })
    .then(({ animals }) => {
      setPets(animals || []);
    });
}
```

Here we're simulating a submit event to search for pets and then checking it properly called the API and then renders the correct animal list length. Let's go add the testid we need in Results.js

```javascript
// outtermost div
<div className="search" data-testid="search-results">
```

Now we're actually testing some user interaction. The key here is try not to test the implementation details. We could refactor the component to _do_ the same the thing but internally work totally differently. Should our unit tests break? No! It should work in any case. You should test as if your components were a blackbox, as if you were simply a user of your app with zero knowledge of how it was written.

One last test, the famous snapshot test:

```javascript
// last test
expect(container.firstChild).toMatchInlineSnapshot();
```

Here we're doing a Jest test in which we're doing a snapshot test. As soon as you run this test the first time, it'll run and capture the output in a snapshot template string (you'll see it after you run it successfully the first time.) Every time afterwards when you run it it will compare the output with this snapshot. If it changes, it'll fail the test. If you mean to change it, you just run `jest -u` and it will update the snapshots. Cool, right? You can also have it write to an external file instead of inline in the code with `toMatchSnapshot`. I like that everything is in one file. It's up to you.

Add that your package.json: `"test:update": "jest -u",`

Now your snapshot test should pass. Check out that it created a `__snapshots__` directory with your snapshot in it (if you did it `toMatchSnapshot`). You should commit this file as everyone should get the same output as you.

Let's talk about code coverage. Luckily has it built into jest because it can be a bit of a pain to set up. It's a tool called [istanbul][istanbul]. Istanbul generates a report of how much of you code is covered by tests. It's a useful metric to track you're generally adding tests when you add new features but by no means does a 100% test-covered project means that those tests are good. It's easy to write garbage tests, and garbage tests hurt more than help.

In any case, run `npx jest --coverage` to try it out. It'll show you an outline of the results in the CLI and then generate a report in a new `coverage` directory (don't check this in to git.) Open coverage/lcov-report/index.html to see a nice web page outlining your test coverage. Add this to your package.json:
`"test:coverage": "jest --coverage",`.

One more useful thing about Jest: watch mode. You can run your tests interactively and on file-save. It'll only re-run tests that could have possibly been changed and previously failed so it's a fast feedback cycle to fix tests. Add this as well to your package.json: `"test:watch": "jest --watch",`.

## 🌳 branch [testing](https://github.com/btholt/complete-intro-to-react-v5/tree/testing)

[kcd]: https://frontendmasters.com/courses/testing-react/
[jest]: https://jestjs.io
[jasmine]: https://jasmine.github.io/
[enzyme]: http://airbnb.io/enzyme/
[istanbul]: https://istanbul.js.org
[res]: https://raw.githubusercontent.com/btholt/complete-intro-to-react-v5/testing/__mocks__/@frontendmasters/res.json
