import React from "react";

export function Start({ children }) {
  return (
    <div className="start__x">
      {children}
      <svg
        viewBox="250 63.672 202.328 111.328"
        xmlns="http://www.w3.org/2000/svg"
        className="start"
      >
        <path
          className="start__line"
          d="M 341.66 103.74 C 338.4 119.568 320.856 159.748 269.653 150"
        />
        <path
          className="start__point"
          d="M 280 125 C 270 145 250 150 250 150 C 250 150 270 155 280 175"
        />
        <text className="start__text" x="287.329" y="92.16">
          Start here!
        </text>
      </svg>
    </div>
  );
}
