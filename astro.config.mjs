import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://dkphhh.me",
  env: {
    schema: {
      OPEN_ROUTER_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [svelte(), sitemap()],
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