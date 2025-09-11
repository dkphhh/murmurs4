<script lang="ts">
  import { onMount } from "svelte";

  let menu: HTMLUListElement;
  let customButton: HTMLDivElement;

  const customEvent = new CustomEvent("custom-event", {
    bubbles: true,
    cancelable: false,
    detail: {
      message: "This is a custom event",
      time: new Date(),
    },
  });

  onMount(() => {
    // 这里可以添加一些初始化代码
    menu.addEventListener("click", (event: MouseEvent) => {
      if ((event.target as HTMLAnchorElement).tagName === "A") {
        alert(
          `You clicked ${(event.target as HTMLAnchorElement).getAttribute("href")}`
        );
      }
    });

    customButton.addEventListener("custom-event", (event: Event) => {
      alert(`Custom event received: ${(event as CustomEvent).detail.message}`);
    });

    customButton.addEventListener("click", () => {
      alert("Custom button clicked!");
      customButton.dispatchEvent(customEvent);
    });
  });
</script>

<ul id="menu" class="flex space-x-2" bind:this={menu}>
  <li><a class="btn" href="/html">HTML</a></li>
  <li><a class="btn" href="/javascript">JavaScript</a></li>
  <li><a class="btn" href="/css">CSS</a></li>
  <li><div bind:this={customButton} class="btn">Custom Event</div></li>
</ul>
