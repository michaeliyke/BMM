import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: false,
    },
    globals: true, // ✅ Enables global test functions like `describe` & `it`
    environment: "jsdom", // ✅ Required for DOM-based tests
    setupFiles: "./src/test/setup.ts", // ✅ Optional
    typecheck: {
      tsconfig: "./tsconfig.test.json", // ✅ Ensure tests use the relaxed TypeScript config
    },
  },
})
