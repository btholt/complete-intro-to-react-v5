import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import DetailsPrac from "./DetailsPractice";
import SearchParamsPrac from "./SearchParamsPractice";
import ThemeContextPrac from "./ThemeContextPractice";

const App = () => {
  const theme = useState("darkblue");
  return (
    <ThemeContextPrac.Provider value={theme}>
      <div>
        <header>
          <Link to="/">Adopt Me!</Link>
        </header>
        <Router>
          <SearchParamsPrac path="/" />
          <DetailsPrac path="/details/:id" />
        </Router>
      </div>
    </ThemeContextPrac.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));


// const Pet = ({ name, animal, breed }) => {
//     return React.createElement("div", {}, [
//         React.createElement("h1", {}, name),
//         React.createElement("h2", {}, animal),
//         React.createElement("h2", {}, breed)
//     ]);
// };


// const App = () => {
//   return React.createElement( "div", { id: "something-important" }, [
//         React.createElement("h1", {}, "Adopt me!"),
//         React.createElement(Pet, { 
//             name: "Mimi", 
//             animal: "Cat", 
//             breed: "Ginger Tabby"
//         }),
//         React.createElement(Pet, { 
//             name: "Kylo Ren", 
//             animal: "Cat", 
//             breed: "Blue Grey Mix"
//         }),
//         React.createElement(Pet, { 
//             name: "Teddy", 
//             animal: "Dog", 
//             breed: "Husky"
//         })
//     ]);
// };

// ReactDom.render(
//   React.createElement(App), 
//   document.getElementById("root")
// );
