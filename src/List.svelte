<script>
  export let location = location;
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";

  let header;
  let problems = null;
  onMount(async () => {
    try {
      diffBusy(+1);
      const response = await fetch("/api/problemset");
      problems = await response.json();
    } finally {
      diffBusy(-1);
    }
  });

  let busy = 0;
  function diffBusy(diff) {
    busy += diff;
    header.classList.remove("busy");
    if (busy > 0) header.classList.add("busy");
  }
</script>

<div class="header row center" bind:this={header}>
  <div class="gap" />
  <Link to="/">codeforces.dev</Link>
</div>

<main>
  {#if problems}
    <table>
      {#each problems as problem}
        <tr>
          <td align="right">{problem.contestId}</td>
          <td align="right">{problem.index}</td>
          <td>
            <Link to={`/problemset/problem/${problem.contestId}/${problem.index}`}>
              {problem.name}
            </Link>
          </td>
          <td align="right">{problem.points || ""}</td>
          <td align="right">{problem.rating}</td>
          <td align="right">{problem.solvedCount}</td>
          <td style="opacity: 0.5">{problem.tags.join(", ")}</td>
        </tr>
      {/each}
    </table>
  {/if}
</main>

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
    z-index: 11;
    background-color: white;
  }
  main {
    padding: 4em 1em 1em 1em;
  }
</style>
