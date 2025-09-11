<script lang="ts">
  import { onMount } from "svelte";
  function handler1(event: MouseEvent) {
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  }
  let elem: HTMLInputElement;

  onMount(() => {
    // 这里可以添加一些初始化代码
    elem.addEventListener("click", handler1);
  });
</script>

<input
  class="btn"
  id="elem"
  type="button"
  value="Show Coordinates"
  bind:this={elem}
/>
