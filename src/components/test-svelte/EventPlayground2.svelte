<script lang="ts">
  import { onMount } from "svelte";

  function handler1() {
    alert("Thanks!");
  }

  function handler2() {
    alert("Thanks again!");
  }

  let elem: HTMLInputElement;

  onMount(() => {
    // 这里可以添加一些初始化代码
    elem.onclick = () => alert("Hello");
    elem.addEventListener("click", handler1); // Thanks!
    elem.addEventListener("click", handler2); // Thanks again!
  });
</script>

<input class="btn" id="elem" type="button" value="Say Hello" bind:this={elem} />
