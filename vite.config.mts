import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                'route-manager': resolve(__dirname, 'src/route-manager.ts'),
            },
            name: 'Docolate'
        },
        sourcemap: true
    },
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