<script lang="ts">


    function hiddenTarget() {
        const target = document.getElementById("target") as HTMLHeadingElement;
        const isHidden = target?.hidden === true;

        if (isHidden) {
            if (target) {
                target.hidden = false;
                target.classList.add("text-red-500");
            }
        } else {
            if (target) {
                target.hidden = true;
                target.classList.remove("text-red-500");
            }
        }
    }
</script>

<div
    class="flex flex-col items-center justify-center gap-4 w-[90vw] md:w-[60vw] h-full"
>
    <h1 id="target" class="123" about="011">Document Component</h1>
    <p>
        Attributes:{document.getElementById("target")?.getAttribute("about") ===
            undefined}
    </p>
    <button class="btn" onclick={hiddenTarget}>Action</button>
</div>
