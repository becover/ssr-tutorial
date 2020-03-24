import React from "react";
import ReactDOMServer from "react-router-dom";

const html = ReactDOMServer.renderToString(
  <div>Hello Server Side Rendering!</div>
);

console.log(html);
