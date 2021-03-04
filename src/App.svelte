<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import List from "./List.svelte";
  import Edit from "./Edit.svelte";
</script>

<Router>
  <Route path="problemset/problem/:contestId/:index" component={Edit} />
  <Route component={List} />
</Router>

<style>
</style>
