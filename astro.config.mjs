import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://your-project.vercel.app",

  output: "server",

  adapter: vercel(),

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  compressHTML: true,
});