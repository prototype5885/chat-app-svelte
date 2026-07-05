import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

const backendAddress = "http://localhost:1848";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  base: "/svelte",
  server: {
    host: "localhost",
    port: 3000,
    proxy: {
      "/api": {
        target: backendAddress,
      },
      "/avatars": {
        target: backendAddress,
      },
      "/attachments": {
        target: backendAddress,
      },
    },
  },
});
