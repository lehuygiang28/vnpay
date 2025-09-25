import fs from 'fs';
import path from 'path';
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
                // Fix dayjs plugin imports in ESM files
                const distDir = path.resolve('dist');
                const files = fs.readdirSync(distDir);

                for (const file of files) {
                    if (file.endsWith('.js') && !file.endsWith('.map')) {
                        const filePath = path.join(distDir, file);
                        let content = fs.readFileSync(filePath, 'utf8');

                        // Replace dayjs plugin imports with .js extensions
                        content = content.replace(
                            /from 'dayjs\/plugin\/(timezone|utc)'/g,
                            "from 'dayjs/plugin/$1.js'",
                        );
                        content = content.replace(
                            /import 'dayjs\/plugin\/(timezone|utc)'/g,
                            "import 'dayjs/plugin/$1.js'",
                        );

                        if (content !== fs.readFileSync(filePath, 'utf8')) {
                            fs.writeFileSync(filePath, content);
                            console.log(`🔧 Fixed dayjs imports in ${file}`);
                        }
                    }
                }

                console.log('✅ Build completed successfully!');
                console.log('📦 Package ready for publishing');
            }
        },
    };
});
