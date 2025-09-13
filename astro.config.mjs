import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://dkphhh.me",

  env: {
    schema: {
      OPEN_ROUTER_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      MURMURS_PATH: envField.string({
        context: "server",
        access: "public",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [svelte(), sitemap(), pagefind({
    
  })],
  image: {
    layout: "constrained",
    responsiveStyles: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.dkphhh.me",
      },
    ],
  },
});
