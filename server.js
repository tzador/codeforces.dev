require("isomorphic-fetch");
const express = require("express");
const cheerio = require("cheerio");
const html = require("html");

const app = express();

app.get("/api/headers", (req, res) => {
  res.json(req.headers);
});

app.get("/api/problemset/", async (req, res) => {
  const response = await fetch("https://codeforces.com/api/problemset.problems");
  const data = await response.json();
  res.json(data);
});

app.get("/api/problemset/problem/:contestId/:index", async (req, res) => {
  const response = await fetch(`https://codeforces.com/problemset/problem/${req.params.contestId}/${req.params.index}`);
  const $ = cheerio.load(await response.text());
  res.type("text/plain");
  for (const section of $(".problem-statement > *")) {
    res.write(html.prettyPrint(cheerio.html(section), { indent_size: 4 }));
    res.write(JSON.stringify(section.class));
    res.write("\n\n\n");
  }

  const pres = [];
  for (const pre of $(".problem-statement .sample-tests pre")) {
    pres.push($(pre).text());
  }
  res.write(JSON.stringify(pres));

  res.end();
});

app.use(express.static("public"));
app.get("/*", (req, res) => res.sendFile(__dirname + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("http://localhost:" + port);
});
