<script>
  export let location = location;
  export let contestId = contestId;
  export let index = index;

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { themes } from "./themes.js";

  let textarea;
  let editor;
  let theme;

  onMount(() => {
    editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
    });
    editor.setOption("theme", "pastel-on-dark");
    theme = localStorage.getItem("theme") || "pastel-on-dark";
    changeTheme();
  });

  function changeTheme() {
    localStorage.setItem("theme", theme);
    editor.setOption("theme", theme);
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
  <select>
    <option value="c++">c++</option>
    <option value="java">java</option>
    <option value="python">python</option>
  </select>
  <div class="gap" />
  <button>Run All</button>
  <div class="gap" />
</div>
<div class="left" />

<div class="right">
  <textarea bind:this={textarea} />
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
