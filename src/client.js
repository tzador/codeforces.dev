import App from "./App.svelte";

analytics.logEvent("welcome");

export default new App({ target: document.body });
