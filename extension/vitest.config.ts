import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      all: false,
    },
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
