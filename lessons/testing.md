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
- Add `API_KEY` and `API_SECRET` to a `.env` file ([more info in previous section](effects))
- `npm run dev` to start the server on http://localhost:1234/

This is meant to be a very brief treatise on how to do testing on React applications. Frontend Masters already has a [thorough course on how to test React applications][kcd] here from Kent C. Dodds. This will be a brief intro on how to set up Jest tests for the application we just created.

## Testing with Jest

First we'll start with [Jest][jest]. Jest is the testing framework that Facebook puts out. It is not at all tied to React despite both being maintained by Facebook. It's useful for other frameworks and I use it frequently with Node.js applications.

It's useful to know that Jest is built on top of [Jasmine][jasmine]. Jasmine does the underlying testing part while Jest is the highlevel runner of the tests. Sometimes it's useful to consult the Jasmine docs too.

So let's start testing our application. Run `npm install -D jest react-testing-library`.

`react-testing-library` is made by another Frontend Masters teacher, [Kent C. Dodds][kcd]. This tool has a bunch of convenience features that make testing React significantly easier and is now the recommended way of testing React, supplanting [Enzyme][enzyme]. Previous versions of this course teach Enzyme if you'd like to see that.

Next go into your src directory and create a folder called `__tests__`. Notice that's double underscores on both sides. Why double? They borrowed it from Python where double underscores ("dunders" as I've heard them called) mean something magic happens. In this case, Jest assumes all JS files in here are tests.

We're going to write tests for SearchParams. But remember that SearchParmas use `petfinder-client` to make API requests, something we can't do in Node.js. Luckily we can make a mock of it. In the root directly of the project, create a folder called `__mocks__`. If a put a file in here called `lodash.js`, that file will be imported anywhere I have `import _ from "lodash"`. It's so we can mock modules (like `petfinder-client`) that wouldn't make sense to run in Node or for your tests. So create the folder, create a file called `petfinder-client.js` and put in it:

```javascript
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

const doggos = {
  petfinder: {
    lastOffset: "25",
    pets: {
      pet: [
        {
          options: {
            option: "hasShots"
          },
          status: "A",
          contact: {
            phone: null,
            state: "WA",
            address2: null,
            email: "example@example.com",
            city: "Puyallup",
            zip: "98372",
            fax: null,
            address1: "1234 Fake Ave"
          },
          age: "Senior",
          size: "S",
          media: {
            photos: {
              photo: [
                {
                  "@size": "pnt",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/1/?bust=1548744791&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/1/?bust=1548744791&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/1/?bust=1548744791&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/1/?bust=1548744791&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/1/?bust=1548744791&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/2/?bust=1548744798&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/2/?bust=1548744798&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/2/?bust=1548744798&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/2/?bust=1548744798&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/2/?bust=1548744798&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/3/?bust=1549603726&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/3/?bust=1549603726&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/3/?bust=1549603726&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/3/?bust=1549603726&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/3/?bust=1549603726&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/4/?bust=1549603726&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/4/?bust=1549603726&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/4/?bust=1549603726&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/4/?bust=1549603726&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/4/?bust=1549603726&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/5/?bust=1549603726&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/5/?bust=1549603726&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/5/?bust=1549603726&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/5/?bust=1549603726&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884893/5/?bust=1549603726&width=50&-t.jpg"
                }
              ]
            }
          },
          id: "0000",
          shelterPetId: null,
          breeds: {
            breed: "Havanese"
          },
          name: "Luna",
          sex: "F",
          description: "Luna is a very special little Havanese mix.",
          mix: "yes",
          shelterId: "XXXX",
          lastUpdate: "2019-01-29T06:55:53Z",
          animal: "Dog"
        },
        {
          options: {
            option: ["specialNeeds", "hasShots"]
          },
          status: "A",
          contact: {
            phone: null,
            state: "WA",
            address2: null,
            email: "example@example.com",
            city: "Puyallup",
            zip: "98372",
            fax: null,
            address1: "1234 FAke Ave"
          },
          age: "Senior",
          size: "S",
          media: {
            photos: {
              photo: [
                {
                  "@size": "pnt",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/1/?bust=1548744501&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/1/?bust=1548744501&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/1/?bust=1548744501&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/1/?bust=1548744501&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/1/?bust=1548744501&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/2/?bust=1548744504&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/2/?bust=1548744504&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/2/?bust=1548744504&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/2/?bust=1548744504&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/2/?bust=1548744504&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/3/?bust=1549603831&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/3/?bust=1549603831&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/3/?bust=1549603831&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/3/?bust=1549603831&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "3",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/3/?bust=1549603831&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/4/?bust=1549603831&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/4/?bust=1549603831&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/4/?bust=1549603831&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/4/?bust=1549603831&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "4",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/4/?bust=1549603831&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/5/?bust=1549603831&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/5/?bust=1549603831&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/5/?bust=1549603831&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/5/?bust=1549603831&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "5",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/5/?bust=1549603831&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "6",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/6/?bust=1549603832&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "6",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/6/?bust=1549603832&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "6",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/6/?bust=1549603832&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "6",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/6/?bust=1549603832&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "6",
                  value:
                    "http://photos.petfinder.com/photos/pets/43884811/6/?bust=1549603832&width=50&-t.jpg"
                }
              ]
            }
          },
          id: "0001",
          shelterPetId: null,
          breeds: {
            breed: "Havanese"
          },
          name: "Piper",
          sex: "F",
          description: "Piper is a very special little Havanese mix.",
          mix: "yes",
          shelterId: "XXXX",
          lastUpdate: "2019-01-29T06:51:49Z",
          animal: "Dog"
        },
        {
          options: {
            option: ["altered", "hasShots", "housetrained"]
          },
          status: "A",
          contact: {
            phone: "email only  ",
            state: "WA",
            address2: null,
            email: "example@example.com",
            city: "Blaine",
            zip: "98230",
            fax: null,
            address1: null
          },
          age: "Adult",
          size: "S",
          media: {
            photos: {
              photo: [
                {
                  "@size": "pnt",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/1/?bust=1551287084&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/1/?bust=1551287084&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/1/?bust=1551287084&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/1/?bust=1551287084&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "1",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/1/?bust=1551287084&width=50&-t.jpg"
                },
                {
                  "@size": "pnt",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/2/?bust=1551287097&width=60&-pnt.jpg"
                },
                {
                  "@size": "fpm",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/2/?bust=1551287097&width=95&-fpm.jpg"
                },
                {
                  "@size": "x",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/2/?bust=1551287097&width=500&-x.jpg"
                },
                {
                  "@size": "pn",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/2/?bust=1551287097&width=300&-pn.jpg"
                },
                {
                  "@size": "t",
                  "@id": "2",
                  value:
                    "http://photos.petfinder.com/photos/pets/44114309/2/?bust=1551287097&width=50&-t.jpg"
                }
              ]
            }
          },
          id: "44114309",
          shelterPetId: "Lolita and Charlotte",
          breeds: {
            breed: "Havanese"
          },
          name: "Lolita and Charlotte",
          sex: "F",
          description:
            "These dogs, Charlotte and Lolita, will be memorial dogs to a great Furbaby Rescue volunteer who passed away suddenly.",
          mix: "yes",
          shelterId: "XXXX",
          lastUpdate: "2019-02-27T17:05:45Z",
          animal: "Dog"
        }
      ]
    }
  }
};

export const ANIMALS = ["dog", "cat", "bird"];
export const _breeds = breeds;
export const _dogs = doggos;

const mock = {
  breed: {
    list: jest.fn(() => {
      const mockData = {
        petfinder: {
          breeds: {
            breed: breeds
          }
        }
      };

      return {
        then: callback =>
          act(() => {
            callback(mockData);
          })
      };
    })
  },
  pet: {
    find: jest.fn(() => {
      return {
        then: callback =>
          act(() => {
            callback(doggos);
          })
      };
    })
  }
};

export default function() {
  return mock;
}
```

- A lot of the length here is from mock data. I just literally looked at one of the responses from Petfinder and took a few items. Feel free to do the same.
- Here we're having to do a few odd things. The first you'll notice we're mimicking the API of the `petfinder-client`. We're exporting an `ANIMALS` variable and a default object which has `breed.list` and `pet.find` methods.
- These are in turn returning fake promises. We're doing this so we can wrap these actions in `act` calls from `react-testing-library` (that method actually originates from `react-test-renderer`, the underlying `react-dom`-like library made for testing.) `act` allows React to correctly batch updates to better simulate the browser. If you don't do this, the behavior can be non-deterministic (which means if you run it twice you make get two different results) and cause flaky tests. It has the added benefit of being synchronous and faster.
- We're also exporting the breeds and dogs objects which are the underlying data structures. This is because we want to compare that if we return five breeds from the API, that we have five options inside the dropdown.
- We're using `jest.fn` so we can spy on these functions later to make sure that the app is calling the API on startup.

Now make a file called SearchParams.test.js. In there put:

```javascript
import React from "react";
import { render, cleanup } from "react-testing-library";
import petfinder, { _breeds, _dogs, ANIMALS } from "petfinder-client";
import SearchParams from "../SearchParams";

afterEach(cleanup);

test("SearchParams", async () => {
  const pf = petfinder();
  const { getByTestId } = render(<SearchParams />);

  const animalDropdown = getByTestId("use-dropdown-animal");
  expect(animalDropdown.children.length).toEqual(ANIMALS.length + 1);
});
```

Now in `useDropdow.js` put this so we can grab the correct select:

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
expect(pf.breed.list).toHaveBeenCalled();
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
expect(pf.pet.find).toHaveBeenCalled();
expect(searchResults.children.length).toEqual(_dogs.petfinder.pets.pet.length);
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
