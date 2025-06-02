import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "/popup/index.html",
        upload: "/upload/index.html",
        sw: "/popup/background/sw.ts",
      },
      output: {
        entryFileNames: function createName(chunk) {
          return chunk.name === "sw"
            ? "popup/background/sw.js"
            : "assets/js/[name].js";
        },
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/[ext]/[name].[ext]',
      },
    },
  },
});
