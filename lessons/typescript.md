---
title: "TypeScript"
path: "/typescript"
order: 22
---

TypeScript is a thin layer on top of JavaScript that adds the power of a static checker to your code base. This means you'll have another layer of protection helping protect you against dumb bugs like `var x = 5; x.toUpperCase()`: things that a normal linter can't find but a type system can.

This is going to be a brief intro: how to set it up and get going with it. If you want more TypeScript goodness, check out [Mike North's course][mike].

First thing, `npm install -D typescript`. Then run `npx tsc --init`. `npx` will run the TypeScript tool directly from your node_modules and init your project for you. You'll see now a tsconfig.json. We don't need to set up anything else since Parcel already knows how to handle TypeScript files.

Next we need to install the types for our project. Not all projects are written in TypeScript so another project, DefinitelyTyped, provides third party types for your library. In order to install these types, run `npm install -D @types/react @types/react-dom @types/reach__router`. This will grab all these type definitions.

This is a migration: we're going to migrate one file at a time to being a TypeScript file. As we migrate each file, we'll change it from being a `.js` file to a `.tsx` file. Let's start with Modal.tsx (make sure you rename it to `.tsx`)

```typescript
// taken from React docs
import React from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

class Modal extends React.Component {
  private el = document.createElement("div");

  public componentDidMount() {
    if (modalRoot) {
      modalRoot.appendChild(this.el);
    }
  }

  public componentWillUnmount() {
    if (modalRoot) {
      modalRoot.removeChild(this.el);
    }
  }

  public render() {
    return createPortal(this.props.children, this.el);
  }
}

export default Modal;
```

Fairly similar. We had to make it so `el` could never potentially be null by moving it out of the constructor. Then we have to do a null check on modalRoot because that could be null too. TypeScript will force you to do this a lot, but it will save you run time errors. Notice we didn't write any types down: TypeScript is smart enough to figure out types on its own most of the time.

We also need to say if each item is public or private. All life cycle methods are public since React calls them, but nothing should be accessing `el`, only the element itself.

Let's take the time now to migrate from ESLint to TSLint. TypeScript has its own linter that it uses and it's helpful to have those additional rules.

1. Run `npm uninstall eslint babel-eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`
1. Run `npm install -D tslint tslint-react tslint-config-prettier`
1. Delete .eslintrc.json
1. Change your package.json lint entry to `"lint": "tslint --project .",`
1. Add the following to a new file, tslint.json

```json
{
  "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  "rules": {
    "ordered-imports": false,
    "object-literal-sort-keys": false,
    "interface-name": false,
    "member-ordering": false,
    "no-console": false
  }
}
```

Now you're linting as well as type checking! I disabled some really annoying rules for you. You're welcome.

Let's go fix another file. Details.tsx.

```tsx
// imports
import { PetResponse, PetMedia } from "petfinder-client";
import { navigate, RouteComponentProps } from "@reach/router";

// before pf call
if (!process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error("no API keys");
}

class Details extends React.Component<RouteComponentProps<{ id: string }>> { … }

// replace state
public state = {
  loading: true,
  showModal: false,
  name: "",
  animal: "",
  location: "",
  description: "",
  media: {} as PetMedia,
  breed: ""
};

// first thing inside petfinder.pet.get.then
if (!data.petfinder.pet) {
  navigate("/");
  return;
}
```

- We need to tell TypeScript what props each component expects. Now when you import that component elsewhere, TS will make sure the consumer passes all the right props in.
- We need to use Reach Router's Router params because the ID param will come from the router, not directly from the consumer.
- We need to assert that we have those process.env keys, so we will throw whenever we don't.
- We have to give all state a default setting. This prevents errors on the initial render and it gives TypeScript the ability to infer all your types.
- It can't tell what type media is so we tell it's a PetMedia object.
- We had to put a null check in the componentDidMount. If the animal comes back empty, we have to handle that case. Here we're just navigating back to home and returning (the return is necessary or TS still won't be happy.)

Now that Details is done, let's go do Carousel.tsx

```tsx
// import
import { PetMedia, PetPhoto } from "./petfinder-types";

// above Carousel
interface Props {
  media: PetMedia;
}

interface State {
  active: number;
  photos: PetPhoto[];
}

// add types to class
class Carousel extends React.Component<Props, State> { … }

// add public to all methods / props

// add types to state
public state: State = {
  photos: [],
  active: 0
};

// modify getDerivedStateFromProps
public static getDerivedStateFromProps({ media }: Props) {
  let photos: PetPhoto[] = [];
  …
}

// modify handleIndexClick
public handleIndexClick = (event: React.MouseEvent<HTMLElement>) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  if (event.target.dataset.index) {
    this.setState({
      active: +event.target.dataset.index
    });
  }
}
```

- React.Component is a generic, in that it can accept other types. Here we're telling it what its state and props will look like.
- Class properties are still new, so we have to use State again to type the state. You would not have to do this if you used a constructor.
- We need to type the event type coming back from the DOM. We know it'll come from an HTML element, and we have to make sure it's not a generic window event. TypeScript forces a lot of this defensive programming.

Carousel is done. Let's do Pet.tsx

```tsx
// import
import { PetMedia, PetPhoto } from "petfinder-client";

interface Props {
  name: string;
  animal: string;
  breed: string;
  media: PetMedia;
  location: string;
  id: string;
}

class Pet extends React.Component<Props> { … }

// add type
let photos: PetPhoto[] = [];
```

Getting easier! Let's go do SearchContext.ts. Notice here it could be ts or tsx; there's no JSX in it so we can just leave it as ts.

```ts
// at top
/* tslint:disable no-empty */

// type breeds
breeds: [] as string[],

// add params to functions
handleAnimalChange(e: React.KeyboardEvent<HTMLInputElement>) {},
handleBreedChange(e: React.ChangeEvent<HTMLSelectElement>) {},
handleLocationChange(event: React.KeyboardEvent<HTMLInputElement>) {},
```

- In general you don't want empty body functions but here it's okay because it's mostly for testing.
- We want to type breeds to be used later.
- You have to type the params of the SearchContext because TypeScript uses these definitions everywhere.

Let's go do SearchBox.tsx

```tsx
// add interface, add public to render, add type to generic
interface Props {
  search: () => void;
}

class Search extends React.Component<Props> {
  public render() {
    …
  }
}
```

Easy. Now let's go do Results.tsx

```tsx
// import
import pf, { Pet as PetType } from "petfinder-client";
import { RouteComponentProps } from "@reach/router";

if (!process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error("you need API keys");
}

// above class
interface Props {
  searchParams: {
    location: string;
    animal: string;
    breed: string;
  };
}

interface State {
  pets: PetType[];
}

class Results extends React.Component<Props & RouteComponentProps, State> { … }

// add public to all methods

// constructor
constructor(props: Props) {
  super(props);

  this.state = {
    pets: [] as PetType[]
  };
}

// inside .then
let pets: PetType[];

// export at the bottom
export default function ResultsWithContext(props: RouterProps) { … }
```

- Mostly not new. We're importing types from @reach/router: lots of libraries will do this.
- We also had to use the `&` operator. This will merge those two types to create one intersection type.

Let's go do SearchParams.tsx.

```tsx
// import
import { navigate, RouteComponentProps } from "@reach/router";

// add type generic
class Search extends React.Component<RouteComponentProps> { … }
```

Lastly, let's do App.tsx.

```tsx
// above pf call
if (!process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error("you need API keys");
}

// below pf call
interface State {
  location: string;
  animal: string;
  breed: string;
  breeds: string[];
  handleAnimalChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBreedChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLocationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getBreeds: () => void;
}

// replace class declaration
class App extends React.Component<{}, State> { … }

// add public to all methods

// add type to breeds inside state
breeds: [] as string[],

// redo event listeners
public handleLocationChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  if (event.target instanceof HTMLInputElement) {
    this.setState({
      location: event.target.value
    });
  }
};
public handleAnimalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  if (event.target instanceof HTMLInputElement) {
    this.setState(
      {
        animal: event.target.value
      },
      this.getBreeds
    );
  }
};
public handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  if (event.target instanceof HTMLSelectElement) {
    this.setState({
      breed: event.target.value
    });
  }
};
```

Most of this is making the functions matching the call signatures we've defined for them. Everything else should feel familiar.

This probably felt burdensome to do. In fact, it is. I had a difficult time writing this! Converting existing JS codebasees to TypeScript necessitates a certain amount of writing and rewriting to get all the type signatures in a place that the compiler can verify everything. Be cautious before you call for your team to rewrite.

However, now that we're playing TypeScript land, this code would be joyous to work on. Visual Studio Code will autocomplete for you. TypeScript will _instantly_ let you know when you've made a mistake. You can launch new code with higher certainty that you haven't created run time errors. This all comes at the cost of taking longer to write. Ask yourself if that's a trade-off you're willing to make: if you're a tiny startup that may not happen. If you're as large as Microsoft, maybe! It's a trade-off like all things are. It is a question you should answer before you start a new code base: should we type check?

Last thing, let's add a type check to our package.json just in case someone isn't using a type checking editor. Add `"typecheck": "tsc --noEmit"` to your package.json. This is also useful CI scenarios.

Congrats! You finished TypeScript.

## 🌳 206b5545a1d66c5940d900f346a8ccc90af1bfc4 (branch typescript)

[mike]: https://frontendmasters.com/courses/typescript/
[dt]: https://www.definitelytyped.org
