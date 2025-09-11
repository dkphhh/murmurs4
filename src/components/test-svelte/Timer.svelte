<script lang="ts">
  import { getContext } from "svelte";
  let time = $state(100);
  let maxTime = $state(100); // 设置最大倒计时值为100
  const fruit = getContext<{
    name: string;
    color: string;
    price: number;
  }>("fruit");

  $effect(() => {
    // 只有当倒计时值大于0时才启动或继续计时器
    if (time <= 0) {
      return; // 如果倒计时结束，则不执行任何操作
    }

    const timerId = setInterval(() => {
      if (time > 0) {
        time -= 1;
      } else {
        clearInterval(timerId); // 当倒计时到达0时清除计时器
      }
    }, 1000); // 每1000毫秒（1秒）执行一次

    return () => {
      clearInterval(timerId);
    };
  });
</script>

<div class="flex flex-col items-center w-100 gap-4">
  <label class="w-full">
    <span class="label">Elapsed Time</span>
    <progress class="progress w-full" value={time} max={maxTime}
    ></progress></label
  >

  <label class="w-full">
    <span class="label">Duration</span>
    <input
      id="Duration"
      type="range"
      min="0"
      max="100"
      bind:value={maxTime}
      class="range w-full"
    />
  </label>
  <input type="text" bind:value={fruit.name} />
</div>
