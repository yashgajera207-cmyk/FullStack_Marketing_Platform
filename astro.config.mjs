import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: "http://localhost:4321",

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },

  compressHTML: true,
});