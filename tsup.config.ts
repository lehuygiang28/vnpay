import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    clean: true,
    treeshake: true,
    sourcemap: true,
    minify: true,
    outDir: 'dist',
});
