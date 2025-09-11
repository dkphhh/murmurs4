<script lang="ts">
  import { onMount } from "svelte";

  let button: HTMLButtonElement;
  let paragraph: HTMLParagraphElement;

  onMount(() => {
    button.addEventListener("click", (event: PointerEvent) => {
      console.log("窗口坐标", event.clientX, event.clientY);
      console.log("文档坐标", event.pageX, event.pageY);
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        console.log("You clicked with Ctrl(Command) key + Shift key pressed");
        return;
      }
      console.log("click ", "pointerId=", event.pointerId);
    });
    button.addEventListener("pointerdown", (event: PointerEvent) => {
      console.log("pointerdown ", "button=", event.button);
    });
    button.addEventListener("pointerup", (event: PointerEvent) => {
      console.log("pointerup ", "button=", event.button);
    });

    button.addEventListener("contextmenu", (event: PointerEvent) => {
      console.log("contextmenu ", "button=", event.button);
    });

    button.addEventListener("dblclick", (event: MouseEvent) => {
      console.log("dblclick ", "button=", event.button);
    });

    paragraph.addEventListener("copy", (event: ClipboardEvent) => {
      event.preventDefault();
      console.log("禁止复制");
    });
  });
</script>

<div class="flex gap-2">
  <button class="btn" bind:this={button}>Click</button>
  <p bind:this={paragraph}>这段文本，禁止复制</p>
</div>

