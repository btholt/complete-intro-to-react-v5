When running in `dev:mock` I had to update `data.js` line 41 to cast random id to an int `faker.seed(parseInt(id));`.  Think the way it is created in `mock.js` by passing in the `id` was causing it to be a string.

A lot of the jsx code examples have errant `;` at the end of the snippet.  Not sure if this is intentional or a byproduct of how they were generated.