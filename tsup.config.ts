import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'knexfile.ts'],
  outDir: 'build',
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
});
