import svelteConfig from "./svelte.config.js";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...svelte.configs["flat/recommended"],
  prettier,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
    },
  },

  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },

  {
    // 忽略自动生成的文件
    ignores: [".astro/"],
  },
);
