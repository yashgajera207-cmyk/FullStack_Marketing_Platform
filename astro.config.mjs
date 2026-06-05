
import {
  defineConfig
} from "astro/config";

import tailwindcss
from "@tailwindcss/vite";

import sitemap
from "@astrojs/sitemap";

import node
from "@astrojs/node";

export default defineConfig({

  /* WEBSITE URL */

  site:
    "http://localhost:4321",

  /* OUTPUT */

  output:
    "server",

  /* ADAPTER */

  adapter:
    node({

      mode:
        "standalone"

    }),

  /* INTEGRATIONS */

  integrations: [

    sitemap()

  ],

  /* VITE */

  vite: {

    plugins: [

      tailwindcss()

    ]

  },

  /* IMAGE */

  image: {

    service: {

      entrypoint:
        "astro/assets/services/sharp"

    }

  },

  /* BUILD */

  compressHTML: true

});

