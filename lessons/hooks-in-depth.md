---
title: "Hooks in Depth"
path: "/hooks-in-depth"
order: 21
---

[Open this CodeSandbox.][codesandbox] All of the examples are in there. We will not be using the code in project for this section, just this CodeSandbox.

In the preceding course, we went over `useState`, `useEffect`, `useContext`, and `useRef`. These are the most common hooks and likely 99% of what you're going to use. However it's good to know what other tools are in your toolbox for the 1% of problems. We'll go through, example-by-example, and work out what all these hooks can do for you. (we'll review the ones we've talked about already too.)

## useState

[Component][state].

`useState` allows us to make our components stateful. Whereas this previously required using a class component, hooks give us the ability to write it using just functions. It allows us to have more flexible components. In our example component, everytime you click on the h1 (bad a11y, by the way) it'll change colors. It's doing this by keeping that bit of state in a hook which is being fed in anew every render so it always has the latest state.

## useEffect

[Component][effect]

Effects are how you recreate `componentDidMount`, `componentDidUpdate`, and `componentDidUnmount` from React. Inside `useEffect`, you can do any sort of sidd-effect type action that you would have previously done in one of React's lifecycle method. You can do things like fire AJAX requests, integrate with third party libraries (like a jQuery plugin), fire off some telemetry, or anything else that need to happen on the side for your component.

In our case, we want our component to continually update to show the time so we use setTimeout inside our effect. After the timeout calls the callback, it updates the state. After that render happens, it schedules another effect to happen, hence why it continues to update. You could provide a second parameter of `[]` to `useEffect` (after the function) which would make it only update once. This second array is a list of dependencies: only re-run this effect if one of these parameters changed. In our case, we want to run after every render so we don't give it this second parameter.

## useContext

[Component][context]

An early problem with the React problem is called "data tunneling" or "prop drilling". This is when you have a top level component (in our case the parent component) and a child component way down in the hierarchy that need the same data (like the user object.) We could pass that data down, parent-to-child, for each of the intermediary components but that sucks because now each of `LevelTwo`, `LevelThree`, and `LevelFour` all have to know about the user object even when they themselves don't need it, just their children. This is prop drilling: passing down this data in unnecessary intermediaries.

Enter context. Context allows you to create a wormhole where stuff goes in and a wormhole in a child component where that same data comes out and the stuff in the middle doesn't know it's there. Now that data is available anywhere inside of the `UserContext.Provider`. `useContext` just pulls that data out when given a Context object as a parameter. You don't have to use `useState` and `useContext` together (the data can be any shape, not just `useState`-shaped) but I find it convenient when child components need to be able to update the context as well.

In general, context adds a decent amount of complexity to an app. A bit of prop drilling is fine. Only put things in context that are truly application-wide state like user information or auth keys and then use local state for the rest.

Often you'll use context instead of Redux or another state store. You could get fancy and use `useReducer` and `useContext` together to get a pretty great approximation of Redux-like features.

## useRef

[Component][ref]

Refs are useful for several things, we'll explore two of the main reasons in these examples. I want to show you the first use case: how to emulate instance variables from React.

In order to understand why refs are useful, you need to understand [how closures work][closures]. In our component, when a user clicks, it sets a timeoute to log both the state and the ref's number after a second. One thing to keep in mind that **the state and the ref's number are always the same**. They are never out of lockstep since they're updated at the same time. _However_, since we delay the logging for a second, when it alerts the new values, it will capture what the state was when we first called the timeout (since it's held on to by the closure) but it will always log the current value since that ref is on an object that React consistently gives the same object back to you. Because it's the same object and the number is a property on the object, it will always be up to date and not subject to the closure's scope.

Why is this useful? It can be useful for things like holding on to `setInterval` and `setTimeout` IDs so they can be cleared later. Or any bit of statefulness that _could_ change but you don't want it to cause a re-render when it does.

It's also useful for referencing DOM nodes directly and we'll see that a bit later in this section.

## useReducer

[Component][reducer]

I'm going to assume you're familiar with Redux. If not, there's a brief section on it [here](redux). `useReducer` allows us to do Redux-style reducers but inside a hook. Here, instead of having a bunch of functions to update our various properties, we have one reducer that handles all the updates based on an action type. This is a preferable approach if you have complex state updates or if you have a situation like this: all of the state updates are very similar so it makes sense to contain all of them in one function.

## useMemo

[Component][memo]

`useMemo` and `useCallback` are performance optimizations. Use them only when you already have a performance problem instead of pre-emptively. It adds unnecessary complexity otherwise.

`useMemo` memoizes expensive function calls so they only are re-evaluated when needed. I put in the [fibonacci sequence][fibonacci] in its recursive style to simulate this. All you need to know is that once you're calling `fibonacci` with 30+ it gets quite computationally expensive and not something you want to do unnecessarily as it will cause pauses and jank. It will now only call `fibonacci` if count changes and will just the previous, memoized answer if it hasn't changed.

If we didn't have the `useMemo` call, everytime I clicked on the title to cause the color to change from red to green or vice versa it'd unnecessarily recalculate the answer of `fibonacci` but because we did use `useMemo` it will only calculate it when `num` has changed.

Feel try to remove `useMemo`, get `num` to 40 or so, and then click the h1. It'll be slow.

## useCallback

[Component][callback]

`useCallback` is quite similar and indeed it's implemented with the same mechanisms as `useMemo`. Our goal is that `ExpensiveComputationComponent` only re-renders whenever it absolutely must. Typically whenever React detects a change higher-up in an app, it re-renders everything underneath it. This normally isn't a big deal because React is quite fast at normal things. However you can run into performance issues sometimes where some components are bad to re-render without reason.

In this case, we're using a new feature of React called `React.memo`. This is similar to `PureComponent` where a component will do a simple check on its props to see if they've changed and if not it will not re-render this component (or its children, which can bite you.) `React.memo` provides this functionality for function components. Given that, we need to make sure that the function itself given to `ExpensiveComputationComponent` is the _same_ function every time. We can use `useCallback` to make sure that React is handing _the same fibonacci_ to `ExpensiveComputationComponent` every time so it passes its `React.memo` check every single time. Now it's only if `count` changes will it actually re-render (as evidenced by the time.)

Try removing the useCallback call and see if you get the the count to 40+ that the page crawls as it updates every second.

## useLayoutEffect

[Component][layout-effect]

`useLayoutEffect` is almost the same as `useEffect` except that it's synchronous to render as opposed to scheduled like `useEffect` is. If you're migrating from a class component to a hooks-using function component, this can be helpful too because `useLayout` runs at the same time as `componentDidMount` and `componentDidUpdate` whereas `useEffect` is scheduled after. This should be a temporary fix.

The only time you _should_ be using `useLayoutEffect` is to measure DOM nodes for things like animations. In the example, I measure the textarea after every time you click on it (the onClick is to force a re-render.) This means you're running render twice but it's also necessary to be able to capture the correct measurments.

## useImperativeHandle

[Component][imperative-handle]

Here's one you will likely never directly use but you may use libraries that use it for you. We're going to use it in conjunction with another feature called `forwardRef` that again, you probably won't use but libraries will use on your behalf. Let's explain first what it does using the example and then we'll explain the moving parts.

In the example above, whenever you have an _invalid_ form, it will immediately focus the the first field that's invalid. If you look at the code, `ElaborateInput` is a child element so the parent component shouldn't have any access to the input contained inside the component. Those components are black boxes to their parents. All they can do is pass in props. So how do we accomplish it then?

The first thing we use is `useImperativeHandle`. This allows us to customize methods on an object that is made available to the parents via the `useRef` API. Inside `ElaborateInput` we have two refs: one thate is the one that will be provided by the parent, forwarded through by wrapping the `ElaborateInput` component in a `forwardRef` call which will ten provide that second `ref` parameter in the function call, and then the `inputRef` which is being used to directly access the DOM so we can call `focus` on the DOM node directly.

From the parent, we assign via `useRef` a ref to each of the `ElaborateInput`s which is then forwarded on each on via the `forwardRef`. Now, on these refs inside the parent component we have those methods that we made inside the child so we can call them when we need to. In this case, we'll calling the focus when the parent knows that the child has an error.

Again, you probably use this directly but it's good to know it exists. Normally it's better to not use this hook and try to accomplish the same thing via props but sometimes it may be useful to break this one out.

[codesandbox]: https://codesandbox.io/s/z3ow32rk43
[state]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FState.js
[effect]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FEffect.js
[context]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FContext.js
[ref]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FRef.js
[reducer]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FReducer.js
[memo]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FMemo.js
[callback]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FCallback.js
[layout-effect]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FLayoutEffect.js
[imperative-handle]: https://codesandbox.io/s/z3ow32rk43?module=%2Fsrc%2FImperativeHandle.js
[closures]: https://frontendmasters.com/courses/javascript-foundations/closure-introduction/
[fibonacci]: https://en.wikipedia.org/wiki/Fibonacci_number
