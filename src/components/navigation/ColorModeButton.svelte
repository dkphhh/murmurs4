<script lang="ts">
  import { onMount } from "svelte";

  type Theme = "light" | "dark" | "system" | null;
  let currentTheme: Theme = $state(null);
  let isDarkMode: boolean = $derived(
    currentTheme === "dark" ||
      (currentTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  // 设置主题
  function setTheme(theme: Theme) {
    if (theme) {
      let actualThemeToApply: "light" | "dark";
      if (theme === "system") {
        // 系统模式
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          actualThemeToApply = "dark";
        } else {
          actualThemeToApply = "light";
        }
      } else {
        // 白色模式或黑色模式
        actualThemeToApply = theme;
      }

      document.documentElement.setAttribute("data-theme", actualThemeToApply);

      // 确保设置的主题与 localStorage 中的主题一致
      localStorage.setItem("theme", theme);
      currentTheme = theme;
    } else {
      // 如果没有设置主题，则使用系统模式
      setTheme("system");
    }
  }

  // 组件挂载时初始化
  onMount(() => {
    // 获取用户设置的主题
    const userTheme = localStorage.getItem("theme") as Theme;

    if (userTheme) {
      currentTheme = userTheme;
    } else {
      currentTheme = "system";
    }

    setTheme(currentTheme);
  });
</script>

<label
  class="navigation-item swap swap-rotate lg:absolute lg:bottom-8"
  title="亮/暗色模式"
>
  <!-- this hidden checkbox controls the state -->
  <input
    type="checkbox"
    class="theme-controller"
    bind:checked={isDarkMode}
    onclick={() => {
      if (isDarkMode) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    }}
  />

  <!-- sun icon -->

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="lucide lucide-sun-icon lucide-sun swap-off icon-style h-7 w-7 lg:h-9 lg:w-9"
    ><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path
      d="M12 20v2"
    /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path
      d="M2 12h2"
    /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path
      d="m19.07 4.93-1.41 1.41"
    /></svg
  >

  <!-- moon icon -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="lucide lucide-moon-icon lucide-moon icon-style swap-on"
    ><path
      d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
    /></svg
  >
</label>
