import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const envHotReload = () => ({
  name: "env-hot-reload",
  configureServer(server) {
    const file = path.resolve(__dirname, "../../.env");
    server.watcher.add(file);
    let timer: NodeJS.Timeout | undefined;
    server.watcher.on("change", (changed) => {
      if (changed === file) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => server.restart(), 200);
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), envHotReload()],
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
