<script>
  export let location = location;
  export let contestId = contestId;
  export let index = index;

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { themes } from "./themes.js";

  let textarea;
  let editor;
  let theme = localStorage.getItem("theme") || "pastel-on-dark";
  let mode = localStorage.getItem("mode") || "python";
  let source = localStorage.getItem(`source/${contestId}/${index}/${mode}`);

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
    const response = await fetch(`/api/cheat/${contestId}/${index}`);
    const json = await response.json();
    mode = json.mode;
    source = json.source;
    changeMode();
    changeSource();
  }
</script>

<div class="header row center">
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
<div class="left" />

<div class="right">
  <textarea bind:this={textarea} bind:value={source} on:change={changeSource} on:keyup={changeSource} />
</div>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3em;
    line-height: 3em;
    box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.125);
    z-index: 11;
  }
  .left {
    position: fixed;
    top: 3em;
    left: 0;
    bottom: 0;
    width: 50%;
  }
  .right {
    position: fixed;
    top: 3em;
    right: 0;
    bottom: 0;
    width: 50%;
  }
</style>
