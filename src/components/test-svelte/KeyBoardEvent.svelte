<script lang="ts">
  import { onMount } from "svelte";
  let textArea: HTMLTextAreaElement;
  let input: HTMLInputElement;
  function checkPhoneKey(key: string): boolean {
    return (
      (key >= "0" && key <= "9") ||
      [
        "+",
        "(",
        ")",
        "-",
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ].includes(key)
    );
  }
  onMount(() => {
    textArea.addEventListener("keydown", (e: KeyboardEvent) => {
      let text =
        e.type +
        " key=" +
        e.key +
        " code=" +
        e.code +
        (e.shiftKey ? " shiftKey" : "") +
        (e.ctrlKey ? " ctrlKey" : "") +
        (e.altKey ? " altKey" : "") +
        (e.metaKey ? " metaKey" : "") +
        (e.repeat ? " (repeat)" : "") +
        "\n";

      console.log(text);
      console.log("repeat", e.repeat);
    });
    textArea.addEventListener("keyup", (e: KeyboardEvent) => {
      console.log("keyup", e.key, "code=", e.code);
    });
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault(); // 阻止默认行为
        console.log("输入的电话号码:", input.value);
      }
      if (!checkPhoneKey(e.key)) {
        e.preventDefault(); // 阻止默认行为
      }
    });
  });
</script>

<textarea
  bind:this={textArea}
  class="textarea w-full h-32"
  placeholder="Press any key..."
>
</textarea>


<input
  class="input"
  bind:this={input}
  placeholder="请输入电话号码"
  type="tel"
/>
