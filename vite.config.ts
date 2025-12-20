import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

const backendAddress = "http://127.0.0.1:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    proxy: {
      "/api": {
        target: backendAddress,
      },
      "/cdn": {
        target: backendAddress,
      },
      "/socket.io": {
        target: backendAddress,
        ws: true,
      },
      "/login": {
        target: backendAddress,
      },
      "/register": {
        target: backendAddress,
      },
    },
  },
});
