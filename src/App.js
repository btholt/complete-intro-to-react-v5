import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import Details from "./Details";
import SearchParams from "./SearchParams";
import ThemeContext from "./ThemeContext";

const App = () => {
  const theme = useState("darkblue");
  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <header>
          <Link to="/Complete-Intro-To-React-v5/">Adopt Me!</Link>
        </header>
        <Router>
          <SearchParams path="/Complete-Intro-To-React-v5/" />
          <Details path="/Complete-Intro-To-React-v5/details/:id/" />
        </Router>
      </div>
    </ThemeContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
