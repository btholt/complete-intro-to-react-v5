---
title: "Portals"
path: "/portals"
order: 11
---

Another very new feature React is something called a Portal. You can think of the portal as a separate mount point (the actual DOM node which your app is put into) for your React app. The most common use case for this is going to be doing modals. You'll have your normal app with its normal mount point and then you can also put different content into a separate mount point (like a modal or a contextual nav bar) directly from a component. Pretty cool!

First thing, let's go into index.html and add a separate mount point:

```html
<!-- above #root -->
<div id="modal"></div>
```

This where the modal will actually be mounted whenever we render to this portal. Totally separate from our app root.

Next create a file called Modal.js. I literally took this code _almost_ unchanged from the [React docs][porta]:

```javascript
// taken from React docs
import React from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}

export default Modal;
```

* This will mount a div and mount inside of the portal whenever the Modal is rendered and then _remove_ itself whenever it's unrendered.
* Notice we're using `componentWillUnmount` here. This is one of the few instances where you will need it: cleaning up created DOM divs to not leak memory. You'll also clean up event listeners too.
* Down at the bottom we use React's `createPortal` to pass the children (whatever you put inside `<Modal></Modal>`) to the portal div.

Now go to Details.js and add:

```javascript
// at the top
import Modal from "./Modal";

// add showModal
state = { loading: true, showModal: false };

// above render
toggleModal = () => this.setState({ showModal: !this.state.showModal });

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

// below h2
<button onClick={this.toggleModal}>Adopt {name}</button>;

// below description
{
  showModal ? (
    <Modal>
      <h1>Would you like to adopt {name}?</h1>
      <div className="buttons">
        <button onClick={this.toggleModal}>Yes</button>
        <button onClick={this.toggleModal}>No</button>
      </div>
    </Modal>
  ) : null;
}
```

That's it! That's how you make a modal using a portal in React. This used to be significantly more difficult to do but with portals it became trivial. The nice thing about portals is that despite the actual elements being in different DOM trees, these are in the same React trees, so you can do event bubbling up from the modal. Some times this is useful if you want to make your Modal more flexible (like we did.)

&nbsp;

## 🌳 [133abbf623807651f2585ffcfcc9d58a118d097d](https://github.com/btholt/complete-intro-to-react-v4/commit/133abbf623807651f2585ffcfcc9d58a118d097d)

&nbsp;

[portal]: https://reactjs.org/docs/portals.html
