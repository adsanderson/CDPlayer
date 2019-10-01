import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import { CDPlayer } from "./CDPlayer";

function App() {
  return <CDPlayer />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
