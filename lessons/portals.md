---
title: "Portals and Refs"
path: "/portals-and-refs"
order: 14
---

Another very new feature React is something called a Portal. You can think of the portal as a separate mount point (the actual DOM node which your app is put into) for your React app. The most common use case for this is going to be doing modals. You'll have your normal app with its normal mount point and then you can also put different content into a separate mount point (like a modal or a contextual nav bar) directly from a component. Pretty cool!

First thing, let's go into index.html and add a separate mount point:

```html
<!-- above #root -->
<div id="modal"></div>
```

This where the modal will actually be mounted whenever we render to this portal. Totally separate from our app root.

Next create a file called Modal.js:

```javascript
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

const Modal = ({ children }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
```

- This will mount a div and mount inside of the portal whenever the Modal is rendered and then _remove_ itself whenever it's unrendered.
- We're using the feature of `useEffect` that if you need to clean up after you're done (we need to remove the div once the Modal is no longer being rendered) you can return a function inside of `useEffect` that cleans up.
- We're also using a ref here via the hook `useRef`. Refs are like instance variables for function components. Whereas on a class you'd say `this.myVar` to refer to an instance variable, with function components you can use refs. They're containers of state that live outside a function's closure state which means anytime I refer to `elRef.current`, it's **always referring to the same element**. This is different from a `useState` call because the variable returned from that `useState` call will **always refer to the state of the variable when that function was called.** It seems like a weird hair to split but it's important when you have async calls and effects because that variable can change and nearly always you want the `useState` variable, but with something like a portal it's important we always refer to the same DOM div; we don't want a lot of portals.
- Down at the bottom we use React's `createPortal` to pass the children (whatever you put inside `<Modal></Modal>`) to the portal div.

Now go to Details.js and add:

```javascript
// at the top
import { navigate } from "@reach/router";
import Modal from "./Modal";

// add showModal
state = { loading: true, showModal: false };

// add setState inside componentDidMount
url: animal.url,

// add above render
toggleModal = () => this.setState({ showModal: !this.state.showModal });
adopt = () => navigate(this.state.url);

// add showModal
const {
  media,
  animal,
  breed,
  location,
  description,
  name,
  showModal
} = this.state;

// Replace Themed button
 <button
  style={{ backgroundColor: theme }}
  onClick={this.toggleModal}
>
  Adopt {name}
</button>

// add below description
{
  showModal ? (
    <Modal>
      <div>
        <h1>Would you like to adopt {name}?</h1>
        <div className="buttons">
          <button onClick={this.adopt}>Yes</button>
          <button onClick={this.toggleModal}>No</button>
        </div>
      </div>
    </Modal>
  ) : null;
}
```

We're using the progamattic way of navigating using Reach Router. This is bad accessibility so you should be extra cautious when doing this. The button should be an `<a>` tag but I wanted to show you how to do it. But now if you click Yes on the adopt modal it'll take you to the page when you actually can adopt the pet!

That's it! That's how you make a modal using a portal in React. This used to be significantly more difficult to do but with portals it became trivial. The nice thing about portals is that despite the actual elements being in different DOM trees, these are in the same React trees, so you can do event bubbling up from the modal. Some times this is useful if you want to make your Modal more flexible (like we did.)

&nbsp;

## 🌳 [38ae5138caa276f823983960fc479b368d3978ce](https://github.com/btholt/complete-intro-to-react-v5/commit/38ae5138caa276f823983960fc479b368d3978ce)

&nbsp;

[portal]: https://reactjs.org/docs/portals.html
