<script>
  export let location = location;
  export let contestId = contestId;
  export let index = index;

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { themes } from "./themes.js";

  let header;
  let textarea;
  let editor;
  let blocks = null;
  let theme = localStorage.getItem("theme") || "pastel-on-dark";
  let mode = localStorage.getItem("mode") || "python";
  let source = localStorage.getItem(`source/${contestId}/${index}/${mode}`);
  let busy = 0;

  onMount(async () => {
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
      console.log(blocks);
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

  function diffBusy(diff) {
    busy += diff;
    header.classList.remove("busy");
    if (busy > 0) header.classList.add("busy");
  }
</script>

<div class="header row center" bind:this={header}>
  <div class="gap" />
  <Link to="/">codeforces.dev</Link>
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
  <button>Run</button>
  <div class="gap" />
</div>

<div class="left">
  {#if blocks}
    {#each blocks as block}
      {#if block.class == "sample-tests"}
        {#each block.tests as test}
          <div class="test">
            <div>Input:</div>
            <pre>{test.input}</pre>
            <div class="gap" />

            <div>Expected Output:</div>
            <pre>{test.output}</pre>
            <div class="gap" />

            <div>Your Output:</div>
            <pre>{test.output}</pre>
            <div class="gap" />
          </div>
        {/each}
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
