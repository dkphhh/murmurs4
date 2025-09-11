<script lang="ts">
  import { onMount } from "svelte";

  let scrollDiv: HTMLDivElement;
  let scrollArea: HTMLDivElement;
  let scrollContent: HTMLDivElement;

  onMount(() => {
    scrollArea.addEventListener("scroll", (event: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;

      scrollDiv.innerHTML = `scrollTop：${scrollTop}px clientHeight：${clientHeight}px scrollHeight：${scrollHeight}px`;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        const content = new Date();
        scrollContent.innerHTML += `<div class="h-10 border-b border-gray-300">${content}</div>`;
      } else {
      }
    });
  });
</script>

<div class="flex items-center gap-2">
  <div>当前滚动：</div>
  <div bind:this={scrollDiv}></div>
  <button
    type="button"
    class="btn"
    onclick={() => {
      scrollArea.scrollTop = 0;
    }}>Top</button
  >
</div>

<div
  bind:this={scrollArea}
  class="h-32 w-full overflow-y-auto border-2 border-gray-300"
>
  <div
    bind:this={scrollContent}
    class="bg-gradient-to-b from-blue-200 to-green-200"
  >
    {#each Array(20) as _, i}
      <div class="h-10 border-b border-gray-300">
        {new Date()}
      </div>
    {/each}
  </div>
</div>
