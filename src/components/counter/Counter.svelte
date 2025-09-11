<script lang="ts">
  import { counter } from "./counter.svelte.ts";

  type Props = {
    customMessage: string;
  };

  const { customMessage }: Props = $props();
</script>

<div class="flex flex-col items-center gap-4">
  <p class="text-lg">{customMessage}</p>
  <div class="join">
    <button class="btn join-item" onclick={() => counter.increment()}>+</button>
    <button disabled class="btn join-item">{counter.count}</button>
    <button
      class="btn join-item"
      onclick={() => {
        counter.decrement();
      }}>-</button
    >
  </div>
</div>
