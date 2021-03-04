require("isomorphic-fetch");
const express = require("express");

const app = express();

app.get("/api/problem-set", (req, res) => {
  res.json("todo");
});

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("http://localhost:" + port);
});
