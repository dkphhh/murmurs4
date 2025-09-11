<script lang="ts">
  import { getContext } from "svelte";
  const fruit = getContext<{
    name: string;
    color: string;
    price: number;
  }>("fruit");

  class TemperatureConverter {
    private celsius = $state("");
    private fahrenheit = $state("");

    private isValidNumberString = (str: string) => {
      if (typeof str !== "string" || str.trim() === "") {
        return false; // 不是字符串或为空字符串/纯空格字符串
      }
      const num = Number(str);
      return !isNaN(num) && isFinite(num);
    };

    get Celsius() {
      return this.celsius;
    }

    set Celsius(value: string) {
      if (this.isValidNumberString(value)) {
        this.celsius = value;
        this.fahrenheit = ((parseFloat(value) * 9) / 5 + 32).toFixed(2);
      } else {
        this.celsius = "";
        this.fahrenheit = "";
      }
    }

    get Fahrenheit() {
      return this.fahrenheit;
    }

    set Fahrenheit(value: string) {
      if (this.isValidNumberString(value)) {
        this.fahrenheit = value;
        this.celsius = (((parseFloat(value) - 32) * 5) / 9).toFixed(2);
      } else {
        this.celsius = "";
        this.fahrenheit = "";
      }
    }
  }

  const converter = new TemperatureConverter();
</script>

<div class="flex justify-center items-center gap-4 w-[90vw] md:w-[60vw] h-full">
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Celsius</legend>
    <input
      type="text"
      class="input"
      placeholder="My awesome page"
      bind:value={converter.Celsius}
    />
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Fahrenheit</legend>
    <input
      type="text"
      class="input"
      placeholder="My awesome page"
      bind:value={converter.Fahrenheit}
    />
  </fieldset>
</div>
<input type="text" bind:value={fruit.name} />
