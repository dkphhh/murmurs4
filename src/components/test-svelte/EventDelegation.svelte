<script lang="ts">
  import { onMount } from "svelte";

  class Menu {
    _elem: HTMLElement;
    constructor(elem: HTMLElement) {
      this._elem = elem;
      elem.addEventListener("click", (event:MouseEvent)=>{
        const target = event.target as HTMLElement;
        const action = target.dataset.action as keyof this;
        if (action && typeof this[action] === "function") {
          (this[action] as () => void)();
        }
      });
      elem.addEventListener("click", (event: MouseEvent) => {
        if ((event.target as HTMLElement).dataset.counter === "") {
          const button = event.target as HTMLInputElement;
          const value = parseInt(button.value, 10);
          button.value = (value + 1).toString();
        }
      });
    }

    save() {
      alert("saving");
    }

    load() {
      alert("loading");
    }

    search() {
      alert("searching");
    }


  }
  let menu: HTMLElement;
  onMount(() => {
    // 这里可以添加一些初始化代码
    new Menu(menu);
  });
</script>

<div id="menu" bind:this={menu} class="flex gap-2">
  <button data-action="save" class="btn">Save</button>
  <button data-action="load" class="btn">Load</button>
  <button data-action="search" class="btn">Search</button>
  <input data-counter class="btn" type="button" value="1" />
  <input data-counter class="btn" type="button" value="2" />
</div>
