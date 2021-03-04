require("isomorphic-fetch");
const express = require("express");
const cheerio = require("cheerio");
const html = require("html");

const app = express();
app.set("json spaces", 2);

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

app.get("/api/cheat/:contestId/:index", async (req, res) => {
  const submissions = [];

  {
    const response = await fetch(
      `https://codeforces.com/problemset/status/${req.params.contestId}/problem/${req.params.index}`
    );
    const $ = cheerio.load(await response.text());
    for (const tr of $("tr")) {
      const submissionid = $(tr).attr("data-submission-id");
      if (!submissionid) continue;
      const submission = { id: submissionid };
      for (const td of $("td", tr)) {
        const clazz = ($(td).attr("class") || "lang").split(" ")[0];
        const text = $(td).text().trim();
        submission[clazz] = text;
      }
      if (submission.lang.toLowerCase().startsWith("py") || submission.lang.toLowerCase().startsWith("gnu c")) {
        submission.mode = submission.lang.toLowerCase().startsWith("py") ? "python" : "c++";
        submissions.push(submission);
      }
    }
  }

  {
    const submission = submissions[Math.floor(Math.random() * submissions.length)];
    const response = await fetch(
      `https://codeforces.com/problemset/submission/${req.params.contestId}/${submission.id}`
    );
    const $ = cheerio.load(await response.text());
    submission.source = $("#program-source-text").text();
    res.json(submission);
  }
});

app.use(express.static("public"));
app.get("/*", (req, res) => res.sendFile(__dirname + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("http://localhost:" + port);
});

// const TIMEOUT_MS = 60000;
// const cache = {};
// async function fetchTTL(key, resolver) {
//   let value = cache[key];
//   if (value && value.time >= Date.now() - TIMEOUT_MS) {
//     return value.data;
//   }
//   value = { time: Date.now(), data: await resolver() };
//   cache[key] = value;
//   return value;
// }
