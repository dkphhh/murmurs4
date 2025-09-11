<script lang="ts">
  function addText(event: MouseEvent) {
    const querySelectTest = document.querySelector(
      "body > div > div.flex.flex-col.items-center.justify-center.h-screen.w-full.p-2 > div > div.flex.flex-col.space-y-2",
    ) as HTMLDivElement;
    const p1 = document.createElement("p");
    querySelectTest.prepend(p1);
    if (p1) {
      const userInput = prompt("请输入文本内容");
      p1.textContent = userInput || "默认文本";
      p1.classList.add(
        "text-slate-500",
        "text-lg",
        "font-semibold",
        "text-center",
      );
    }

    (event.currentTarget as HTMLButtonElement).innerText = "Text Added";
  }

  function removeText() {
    const elementToRemove = document.querySelectorAll(
      "body > div > div.flex.flex-col.items-center.justify-center.h-screen.w-full.p-2 > div > div.flex.flex-col.space-y-2.p-b-4 >p",
    ) as NodeListOf<HTMLParagraphElement>;

    elementToRemove.forEach((el) => el.remove());
  }
</script>

<div class=" p-b-4 flex space-x-2">
  <button class="btn" onclick={addText}>Add Text</button>
  <button class="btn" onclick={removeText}>Remove Text</button>
  <button
    class="btn"
    onclick={(event) => {
      alert("This is an alert message!");
      (event.currentTarget as HTMLButtonElement).innerText =
        "Alert Button Clicked";
    }}>Alert</button
  >
</div>
