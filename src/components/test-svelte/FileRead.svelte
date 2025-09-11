<script lang="ts">
    import {onMount} from "svelte";
  let input: HTMLInputElement;
 
  function readFile() {
    if (!input.files?.length) {
      return;
    }

    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onloadstart = () => {
      console.log("开始读取内容");
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        console.log(`读取进度：${percentLoaded}%`);
      } else {
        console.log(`读取进度：${event.loaded} 字节`);
      }
    };

    reader.onload = function () {
      console.log(reader.result);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  }


</script>

<fieldset class="fieldset">
  <legend class="fieldset-legend">Pick a file</legend>
  <input
    type="file"
    class="file-input"
    id="fileInputTest"
    bind:this={input}
    onchange={readFile}
  />
  <label for="fileInputTest" class="label">Max size 2MB</label>
</fieldset>
