<script>
  import { onMount } from "svelte";

  let whoami = null;

  let firebaseUser = null;

  onMount(async () => {
    const response = await fetch("https://codeforces-dev.appspot.com/api/whoami");
    whoami = await response.json();
    return firebase.auth().onAuthStateChanged((user) => {
      firebaseUser = user;
    });
  });

  function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  function logout() {
    auth.signOut();
  }
</script>

{#if whoami}
  <div class="gap" />
  <div style={`width: calc(4/3*2em); height: 2em; background-image: url(${whoami.flag_svg}); background-size: cover`} />
  <div class="gap" />
  {whoami.country}/{whoami.city}
  <div class="gap" />
  {#if firebaseUser}
    <div class="avatar" style={`background-image: url(${firebaseUser.photoURL})`} />
    <div class="gap" />
    {firebaseUser.displayName}
    <div class="gap" />
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={logout}>logout</a>
  {:else}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={login}>login</a>
  {/if}
  <div class="gap" />
{/if}

<style>
  .avatar {
    width: 32px;
    height: 32px;
    background-size: cover;
    border-radius: 50%;
  }
</style>
