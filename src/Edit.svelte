<script>
  export let location = location;
  export let contestId = contestId;
  export let index = index;

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";

  let textarea;

  onMount(() => {
    const editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
    });
    editor.setOption("theme", "pastel-on-dark");
  });
</script>

<div class="header row center">
  <div class="gap" />
  <Link to="/">codeforces.dev</Link>
  <div class="grow" />
  <select>
    <option value="pastel-on-dark">pastel-on-dark</option>
    <option value="pastel-on-dark">pastel-on-dark</option>
    <option value="pastel-on-dark">pastel-on-dark</option>
    <option value="pastel-on-dark">pastel-on-dark</option>
    <option value="pastel-on-dark">pastel-on-dark</option>
  </select>
  <div class="gap" />
  <select>
    <option value="c++">c++</option>
    <option value="java">java</option>
    <option value="python">python</option>
  </select>
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
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
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
