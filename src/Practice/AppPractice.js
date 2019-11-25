const Pet = ({ name, animal, breed }) => {
    return React.createElement("div", {}, [
        React.createElement("h1", {}, name),
        React.createElement("h2", {}, animal),
        React.createElement("h2", {}, breed)
    ]);
};


const App = () => {
  return React.createElement( "div", { id: "something-important" }, [
        React.createElement("h1", {}, "Adopt me!"),
        React.createElement(Pet, { 
            name: "Mimi", 
            animal: "Cat", 
            breed: "Ginger Tabby"
        }),
        React.createElement(Pet, { 
            name: "Kylo Ren", 
            animal: "Cat", 
            breed: "Blue Grey Mix"
        }),
        React.createElement(Pet, { 
            name: "Teddy", 
            animal: "Dog", 
            breed: "Husky"
        })
    ]);
};

ReactDom.render(
  React.createElement(App), 
  document.getElementById("root")
);
