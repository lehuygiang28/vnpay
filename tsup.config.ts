import { defineConfig } from 'tsup';

export default defineConfig((options) => {
    return {
        entry: {
            // Main entry point
            index: 'src/index.ts',
            // Separate entry points for modular imports
            types: 'src/types/index.ts',
            constants: 'src/constants/index.ts',
            enums: 'src/enums/index.ts',
            utils: 'src/utils/index.ts',
            // Core VNPay class only
            vnpay: 'src/vnpay.ts',
            // Types-only export (no runtime code)
            'types-only': 'src/types-only.ts',
        },

        // Output formats for npm packages
        format: ['cjs', 'esm'],

        // TypeScript declaration files
        dts: true,

        // Code splitting for better tree shaking
        splitting: true,

        // Clean output directory
        clean: true,

        // Tree shaking for optimal bundle size
        treeshake: true,

        // External source maps for npm packages (better than inline for debugging)
        sourcemap: true,

        // Conditional minification (disable in watch mode for faster builds)
        minify: false,

        // Output directory
        outDir: 'dist',

        // Bundle Node.js built-ins for better compatibility
        bundle: true,

        // Externalize production dependencies (don't bundle them)
        external: [
            // Externalize all dependencies from package.json
            'dayjs',
            // Node.js built-ins (automatically handled by platform: 'node')
        ],

        // Skip node_modules from bundling (important for libraries)
        noExternal: [],

        // Enable shims for better CJS/ESM compatibility
        shims: true,

        // Keep class names for better debugging
        keepNames: true,

        // Better error reporting
        metafile: true,

        // Custom esbuild options for npm packages
        esbuildOptions(options) {
            // Preserve comments in production builds for license info
            options.legalComments = 'inline';

            // Better source map names
            options.sourceRoot = '../src';
        },

        // Post-build success hook
        onSuccess: async () => {
            if (!options.watch) {
                try {
                    // Import and run the dayjs import fixing helper
                    const { fixDayjsImports } = await import('./scripts/fix-dayjs-imports.ts');
                    await fixDayjsImports();

                    console.log('✅ Build completed successfully!');
                } catch (error) {
                    console.error('❌ Failed to fix dayjs imports:', error);
                    // Don't fail the build, just warn
                    console.log('⚠️  Build completed with warnings');
                }
            }
        },
    };
});
