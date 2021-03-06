<script>
  export let location = location;
  export let contestId = contestId;
  export let index = index;

  import Favicon from "./Favicon.svelte";
  import WhoAmI from "./WhoAmI.svelte";
  import { Link } from "svelte-routing";
  import { themes } from "./themes.js";
  import { onMount } from "svelte";

  let header;
  let leftDiv;
  let textarea;
  let editor;
  let blocks = null;
  let theme = localStorage.getItem("theme") || "pastel-on-dark";
  let mode = localStorage.getItem("mode") || "python";
  let source = localStorage.getItem(`source/${contestId}/${index}/${mode}`);

  onMount(async () => {
    analytics.logEvent("problem");
    const startMs = performance.now();
    try {
      diffBusy(+1);
      const response = await fetch(`/api/problemset/problem/${contestId}/${index}`);
      blocks = await response.json();
      for (const block of blocks) {
        block.escapedHtml = block.html.replace(/\$\$\$([^\$]+)\$\$\$/g, (_, formula) => {
          formula = formula.replace(/&amp;/g, "&");
          formula = formula.replace(/&lt;/g, "<");
          formula = formula.replace(/&gt;/g, ">");
          formula = formula.replace(/&quot;/g, `"`);
          formula = formula.replace(/&#039;/g, `'`);
          return katex.renderToString(formula, {
            throwOnError: false,
          });
        });
      }
    } finally {
      const finishMs = performance.now();
      console.log("statement_ms", finishMs - startMs);
      diffBusy(-1);
    }
  });

  function changeTheme() {
    localStorage.setItem("theme", theme);
    editor.setOption("theme", theme);
  }

  function changeMode() {
    localStorage.setItem("mode", mode);
    editor.setOption("mode", mode == "c++" ? "text/x-c++src" : mode);
  }

  function changeSource() {
    localStorage.setItem(`source/${contestId}/${index}/${mode}`, source);
    editor.setValue(source);
  }

  onMount(() => {
    editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
    });
    changeTheme();
    changeMode();
  });

  async function cheat() {
    analytics.logEvent("cheat");
    const startMs = performance.now();
    try {
      diffBusy(+1);
      const response = await fetch(`/api/cheat/${contestId}/${index}`);
      const json = await response.json();
      mode = json.mode;
      source = json.source;
      changeMode();
      changeSource();
    } finally {
      const finishMs = performance.now();
      console.log("cheat_ms", finishMs - startMs);
      diffBusy(-1);
    }
  }

  async function run() {
    analytics.logEvent("prerun");
    if (!source || !blocks) return;
    analytics.logEvent("run");
    leftDiv.scrollTo(0, Number.MAX_SAFE_INTEGER);
    for (const block of blocks) {
      if (block.class != "sample-tests") continue;
      for (const test of block.tests) {
        try {
          diffBusy(+1);
          test.busy = true;
          blocks = blocks;
          const response = await fetch("https://emkc.org/api/v1/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: mode,
              source: editor.getValue(),
              stdin: test.input,
            }),
          });
          const json = await response.json();
          test.busy = false;
          test.stdout = json.stdout;
          test.stderr = json.stderr;
          test.output = test.output
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .join("\n");
          test.stdout = test.stdout
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .join("\n");
          test.correct = test.stdout == test.output ? "correct" : "incorrect";
          blocks = blocks;
        } finally {
          diffBusy(-1);
        }
      }
    }
  }

  let busy = 0;
  function diffBusy(diff) {
    busy += diff;
    header.classList.remove("busy");
    if (busy > 0) header.classList.add("busy");
  }
</script>

<div class="header row center" bind:this={header}>
  <div class="gap" />
  <Favicon />
  <div class="gap" />
  <Link to="/">codeforces.dev</Link>
  <WhoAmI />
  <div class="grow" />
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={theme} on:change={changeTheme}>
    {#each themes as theme (theme)}
      <option value={theme}>{theme}</option>
    {/each}
  </select>
  <div class="gap" />
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={mode} on:change={changeMode}>
    <option value="c++">c++</option>
    <option value="python">python</option>
  </select>
  <div class="gap" />
  <button on:click={cheat}>Cheat</button>
  <div class="gap" />
  <button on:click={run}>Run</button>
  <div class="gap" />
  <a href="http://bit.ly/2O5e8uP" target="_github">github</a>
  <div class="gap" />
  <a
    href={location.href
      .replace("codeforces.dev", "codeforces.com")
      .replace("http://localhost:8080", "https://codeforces.com")}
    target="_codeforces">codeforces.com</a
  >
  <div class="gap" />
</div>

<div class="left" bind:this={leftDiv}>
  {#if blocks}
    {#each blocks as block}
      {#if block.class == "sample-tests"}
        {#each block.tests as test}
          <hr />
          <div class="test">
            <div>input:</div>
            <pre class={test.busy ? "busy" : ""}>{test.input}</pre>
            <div class="gap" />
            <div>output:</div>
            <pre class={test.busy ? "busy" : ""}>{test.output}</pre>
            <div class="gap" />
            <div>stdout:</div>
            <pre class={test.busy ? "busy " + test.correct : test.correct}>{test.stdout}</pre>
            <div class="gap" />
            <div>stderr:</div>
            <pre class={test.busy ? "busy stderr" : "stderr"}>{test.stderr||""}</pre>
            <div class="gap" />
            {test.busy}
          </div>
        {/each}
        <hr />
      {:else}
        {@html block.escapedHtml}
      {/if}
    {/each}
  {/if}
</div>

<div class="right">
  <textarea bind:this={textarea} bind:value={source} on:change={changeSource} on:keyup={changeSource} />
</div>

<style>
  .header {
    position: fixed;
    top: -1em;
    left: -1em;
    right: -1em;
    height: 4em;
    line-height: 3em;
    padding: 1em 1em 0 1em;
    box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.125);
    z-index: 11;
    box-sizing: border-box;
  }
  .left {
    position: fixed;
    top: 3em;
    left: 0;
    bottom: 0;
    width: 50%;
    padding: 1em;
    box-sizing: border-box;
    overflow: auto;
  }
  .right {
    position: fixed;
    top: 3em;
    right: 0;
    bottom: 0;
    width: 50%;
  }
</style>
