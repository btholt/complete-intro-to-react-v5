const Pet = () => {
    return React.createElement("div", {}, [
        React.createElement("h1", {}, "Mimi"),
        React.createElement("h2", {}, "Cat"),
        React.createElement("h2", {}, "Ginger Tabby"),
    ]);
};


const App = () => {
  return React.createElement(
    "div",
    { id: "something-important" },
    [
        React.createElement("h1", {}, "Adopt me!"),
        React.createElement(Pet),
        React.createElement(Pet),
        React.createElement(Pet)
    ]);
};

ReactDom.render(
  React.createElement(App), 
  document.getElementById("root")
);
