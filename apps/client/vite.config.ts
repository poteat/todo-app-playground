import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

const envHotReload = () => ({
  name: "env-hot-reload",
  configureServer(server: ViteDevServer) {
    const file = path.resolve(__dirname, "../../.env");
    server.watcher.add(file);
    let timer: NodeJS.Timeout | undefined;
    server.watcher.on("change", (changed: string) => {
      if (changed === file) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => server.restart(), 200);
      }
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    envHotReload(),
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
  ],
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
