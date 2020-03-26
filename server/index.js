import express from "express";
import React from "react";
import { renderToNodeStream } from "react-dom/server";
import { ServerLocation } from "@reach/router";
import fs from "fs";
import App from "../src/App";

const PORT = process.env.PORT || 3000;

const html = fs.readFileSync("dist/index.html")
  .toString()
  // when making a request to /details/:id we want the server to reply with
  // <script src="/dist/ClientApp.js"> and <link .. href="/dist/style.css">
  // instead of <script src="dist/ClientApp.js"> which would make a request for 
  // a JavaScript file to <server>:<port>/details/dist/ClientApp.js (which will
  // respond with the index.html file instead of our static resources)
  // the correct url will always make the request to /dist/<resource>
  .replace(/"dist/g, '"/dist');

const parts = html.split("not rendered");

const app = express();

app.use("/dist", express.static("dist"));
app.use((req, res) => {
  res.write(parts[0]);
  const reactMarkup = (
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );

  const stream = renderToNodeStream(reactMarkup);
  stream.pipe(
    res,
    { end: false }
  );
  stream.on("end", () => {
    res.write(parts[1]);
    res.end();
  });
});

console.log(`listening on ${PORT}`);
app.listen(PORT);
