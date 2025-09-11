<script lang="ts">
  import { onMount } from "svelte";

  class Menu {
    elem: HTMLButtonElement;
    constructor(elem: HTMLButtonElement) {
      this.elem = elem;
    }
    handleEvent(event: MouseEvent) {
      switch (event.type) {
        case "mouseover":
          this.elem.innerHTML = "Mouse button pressed";
          break;
        case "mouseout":
          this.elem.innerHTML += "...and released.";
          break;
      }
    }
  }

  let elem: HTMLButtonElement;

  onMount(() => {
    let menu = new Menu(elem);
    elem.addEventListener("mouseover", menu);
    elem.addEventListener("mouseout", menu);
  });
</script>

<button class="btn" id="elem" bind:this={elem}>Click me</button>
