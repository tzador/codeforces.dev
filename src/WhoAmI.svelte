<script>
  import { onMount } from "svelte";

  let whoami = null;

  onMount(async () => {
    const response = await fetch("https://codeforces-dev.appspot.com/api/whoami");
    whoami = await response.json();
    console.log("whoami", whoami);
  });
</script>

{#if whoami}
  <div class="gap" />
  <div style={`width: calc(4/3*2em); height: 2em; background-image: url(${whoami.flag_svg}); background-size: cover`} />
  <div class="gap" />
  {whoami.country}/{whoami.city}
{/if}
