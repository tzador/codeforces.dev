<script>
  import { onMount } from "svelte";
  let canvas;
  let ctx;
  onMount(() => {
    ctx = canvas.getContext("2d");
    requestAnimationFrame(function render() {
      requestAnimationFrame(render);
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let x = (canvas.height * (1 + Math.sin(performance.now() / 1000))) / 2;
      let y = (canvas.height * (1 + Math.sin(performance.now() / 1000 + (2 * Math.PI) / 3))) / 2;
      let z = (canvas.height * (1 + Math.sin(performance.now() / 1000 + (4 * Math.PI) / 3))) / 2;
      ctx.fillStyle = "#f9c843";
      ctx.fillRect(0, canvas.height - x, canvas.width / 3, x);
      ctx.fillStyle = "#1e85c7";
      ctx.fillRect(canvas.width / 3, canvas.height - y, canvas.width / 3, y);
      ctx.fillStyle = "#ae1c21";
      ctx.fillRect((2 * canvas.width) / 3, canvas.height - z, canvas.width / 3, z);
    });
  });
</script>

<canvas width="32" height="32" bind:this={canvas} />

<style>
</style>
