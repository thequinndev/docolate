import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'], 
    coverage: {
      thresholds: {
        100: true,
      },
      reporter: ["text", "json", "html"],
    },
  },
});
