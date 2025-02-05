import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
    server: {
      port: Number(env.VITE_PORT) || 5506,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            apexcharts: ["react-apexcharts", "apexcharts"],
          },
        },
      },
    },
  };
});

