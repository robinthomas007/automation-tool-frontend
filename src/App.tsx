import React from "react";
import logo from "./logo.svg";
import "./App.scss";

function App() {
  console.log("REACT_APP_BASE_URL", process.env.REACT_APP_BASE_URL);
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}

export default App;
