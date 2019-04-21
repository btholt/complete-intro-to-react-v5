---
title: "TypeScript"
path: "/typescript"
order: 19
---

TypeScript is a thin layer on top of JavaScript that adds the power of a static checker to your code base. This means you'll have another layer of protection helping protect you against dumb bugs like `var x = 5; x.toUpperCase()`: things that a normal linter can't find but a type system can.

This is going to be a brief intro: how to set it up and get going with it. If you want more TypeScript goodness, check out [Mike North's course][mike].

First thing, `npm install -D typescript`. Then run `npx tsc --init`. `npx` will run the TypeScript tool directly from your node_modules and init your project for you. You'll see now a tsconfig.json. We don't need to set up anything else since Parcel already knows how to handle TypeScript files. Open your new `tsconfig.json` file and uncomment the `jsx` field. Replace `preserve` with `react`. This lets TypeScript that you're writing React. Then update the target to be `ES2018` so that you can use async / await and promises.

Next we need to install the types for our project. Not all projects are written in TypeScript so another project, DefinitelyTyped, provides third party types for your library. In order to install these types, run `npm install -D @types/react @types/react-dom @types/reach__router`. This will grab all these type definitions.

This is a migration: we're going to migrate one file at a time to being a TypeScript file. As we migrate each file, we'll change it from being a `.js` file to a `.tsx` file. Let's start with Modal.tsx (make sure you rename it to `.tsx`).

```typescript
import React, { useEffect, useRef, ReactChild } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

const Modal = ({ children }: { children: ReactChild[] }) => {
  const elRef = useRef(document.createElement("div"));

  useEffect(() => {
    if (!modalRoot) {
      return;
    }
    modalRoot.appendChild(elRef.current);
    return () => {
      modalRoot.removeChild(elRef.current);
    };
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
```

Fairly similar. We had to make it so the ref could never potentially be null by instantiating it inside the ref. Yes, this will create a new DOM node every time you render, and no that's probably not a big deal. You can do it like we had been doing by using the type `HTMLDivElement | null` but then you have to null check _anywhere_ you use `elRef.current` which is burdensome. This is fine for now; we can refactor if it ends up being a problem.

Then we have to do a null check on modalRoot inside the effect because that could be null too. TypeScript will force you to do this a lot, but it will save you run time errors. Notice we didn't write many types down (just children and the ref type): TypeScript is smart enough to figure out types on its own most of the time.

Notice we're importing the `ReactChild` type from React. Types can be exported from libraries and modules. And then we're asserting it's an array of ReactChildren by throwing the `[]` on the end.

We're also using a generic here. Refs can be one of many things. In this case

Let's take the time now to migrate from ESLint to TSLint. TypeScript has its own linter that it uses and it's helpful to have those additional rules.

1. Run `npm uninstall eslint babel-eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks`
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
    "member-ordering": false,
    "no-console": false,
    "jsx-no-lambda": false
  }
}
```

Now you're linting as well as type checking! I disabled some really annoying rules for you. You're welcome.

Let's quickly do ThemeContext.tsx

```tsx
// replace
const ThemeContext = createContext<[string, (theme: string) => void]>([
  "green",
  () => {}
]);
```

- Here we just have to tell TS that we have a strict ordering of string and function. This will make other files easier to type.
- We're telling it that this function will accept a string which TypeScript will enforce for us later.

Let's go fix another file. Details.tsx.

```tsx
// imports
import pet, { Photo, AnimalResponse } from "@frontendmasters/pet";
import { navigate, RouteComponentProps } from "@reach/router";

class Details extends React.Component<RouteComponentProps<{ id: string }>> { … }

// add public to methods

// replace state
public state = {
  loading: true,
  showModal: false,
  name: "",
  animal: "",
  location: "",
  description: "",
  media: [] as Photo[],
  url: "",
  breed: ""
};

// first thing inside componentDidMount
if (!this.props.id) {
  navigate("/");
  return;
}

// replace then inside componentDidMount
 pet
  .animal(+this.props.id)
  .then(({ animal }: AnimalResponse) => {

// replace catch
.catch((err: Error) => this.setState({ error: err }));

// error boundary
export default function DetailsErrorBoundary(
  props: RouteComponentProps<{ id: string }>
) { … }
```

- We need to tell TypeScript what props each component expects. Now when you import that component elsewhere, TS will make sure the consumer passes all the right props in.
- We need to use Reach Router's Router params because the ID param will come from the router, not directly from the consumer.
- We need to assert that we have those process.env keys, so we will throw whenever we don't. Same thing with the ID from the route props. If Details somehow gets rendered without it, we need to navigate to home (better to a 404 page but we don't have one.)
- We have to give all state a default setting. This prevents errors on the initial render and it gives TypeScript the ability to infer all your types.
- It can't tell what type media is so we tell it's an array of Photos from the pet library.
- We had to put a null check in the componentDidMount. If the animal comes back empty, we have to handle that case. Here we're just navigating back to home and returning (the return is necessary or TS still won't be happy.)
- TS still won't be happy because our other pages haven't been typed yet. We're getting there.

Let's go do ErrorBoundary.tsx now

```tsx
// delete constructor, replace with this:
public state = {
  redirect: "",
  hasError: false
};

// add public to all methods

// add types to componentDidCatch parameters
public componentDidCatch(error: Error, info: ErrorInfo) {
}
```

- We didn't have to change from a constructor to a public class property but it makes typing so much easier because TS knows how to handle it implicitly if you use public class properties.
- We had to type the parameters. We have TS in strict mode which means it doesn't like anything to be an `any` type.

Now that that is done, let's go do Carousel.tsx

```tsx
// import
import { Photo } from "@frontendmasters/pet";

// above Carousel
interface IProps {
  media: Photo[];
}

interface IState {
  active: number;
  photos: string[];
}

// add types to class
class Carousel extends React.Component<IProps, IState> { … }

// add public to all methods / props

// add types to state
public state: State = {
  photos: [],
  active: 0
};

// modify getDerivedStateFromProps
public static getDerivedStateFromProps({
    media
  }: IProps): { photos: string[] } {
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

- React.Component is a generic, in that it can accept other types. Here we're telling it what its state and props will look like. We start the interfaces off with a capital I because this signifies that this is an interface. This is a common pattern and one TSLint enforces.
- We could do this without specifying IState like we did. I'm doing to show you how you can also pass in IState and IProps because it sometimes it's a useful pattern.
- We need to type the event type coming back from the DOM. We know it'll come from an HTML element, and we have to make sure it's not a generic window event. TypeScript forces a lot of this defensive programming.

Carousel is done. Let's do Pet.tsx

```tsx
// import
import React, { FunctionComponent } from "react";
import { Photo } from "@frontendmasters/pet";

interface IProps {
  name: string;
  animal: string;
  breed: string;
  media: Photo[];
  location: string;
  id: id;
}

const Pet: FunctionComponent<IProps> = props => { … }

```

- Here we're telling TS that Pet is a Function Component for React and that it fits all the shapes of a React component.

Now let's go do useDropdown.tsx

```tsx
import { createContext, SetStateAction, Dispatch } from "react";

const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  "green",
  (theme: string) => theme
]);

export default ThemeContext;
```

- We have to be very specifc that we're expecting a useState-like response, hence all the specificity here. We all need to ensure the return function looks and acts just like useState's updater does. It's a lot of ceremony to give ourselves guarantees.

Let's go do SearchParams.tsx

```tsx
// update React import, add Reach Router import
import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent
} from "react";
import { RouteComponentProps } from "@reach/router";
import pet, { ANIMALS, Animal } from "@frontendmasters/pet";

// replace function declaration
const SearchParams: FunctionComponent<RouteComponentProps> = () => {
  …
}

// replace useState calls
const [pets, setPets] = useState([] as Animal[]);
const [breeds, updateBreeds] = useState([] as string[]);
```

- Always need to be defensive about undefined errors. This is one of the benefits of TypeScript, even if it's a bit annoying.
- Occasionally you need to give TypeScript a hint to what it's going to get. That's what `as` for: you're saying I'm sure it's going to be this.
- We have to let React know what sort of parameters this component expects. And in this case it's a Reach Router route so it expects a path so we need let TypeScript in on the secret.

Now let's go do Results.tsx

```tsx
// import
import React, { FunctionComponent } from "react";
import { Animal } from "@frontendmasters/pet";

// above class
interface IProps {
  pets: Animal[];
}

// replace function declaration
const Results: FunctionComponent<IProps> = ({ pets }) => { … }
```

- This how you type FunctionComponents. Not too bad.

Lastly, let's do App.tsx.

```tsx
// Nothing!
```

Because of the rest of the work we did, App needs no changes! Hooray! 🎉

Last thing: open `index.html` and change the link from `App.js` to `App.tsx` and then you should be good to go!

This probably felt burdensome to do. In fact, it is. I had a difficult time writing this! Converting existing JS codebasees to TypeScript necessitates a certain amount of writing and rewriting to get all the type signatures in a place that the compiler can verify everything. Be cautious before you call for your team to rewrite.

However, now that we're playing TypeScript land, this code would be joyous to work on. Visual Studio Code will autocomplete for you. TypeScript will _instantly_ let you know when you've made a mistake. You can launch new code with higher certainty that you haven't created run time errors. This all comes at the cost of taking longer to write. Ask yourself if that's a trade-off you're willing to make: if you're a tiny startup that may not happen. If you're as large as Microsoft, maybe! It's a trade-off like all things are. It is a question you should answer before you start a new code base: should we type check?

Last thing, let's add a type check to our package.json just in case someone isn't using a type checking editor. Add `"typecheck": "tsc --noEmit"` to your package.json. This is also useful CI scenarios.

Congrats! You finished TypeScript.

## 🌳 branch [typescript](https://github.com/btholt/complete-intro-to-react-v5/tree/typescript)

[mike]: https://frontendmasters.com/courses/typescript/
[dt]: https://www.definitelytyped.org
