import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

/**
 * Fix dayjs plugin imports in ESM files by adding .js extensions
 * This addresses the ES module resolution issue where Node.js and bundlers
 * require explicit file extensions for imports.
 */
export async function fixDayjsImports(): Promise<number> {
    try {
        // Validate dist directory exists
        const distDir = resolve('dist');

        try {
            await readdir(distDir);
        } catch (error) {
            console.warn('⚠️  dist directory not found, skipping dayjs import fix');
            return 0;
        }

        const files = await readdir(distDir);

        // Edge case: empty dist directory
        if (files.length === 0) {
            console.log('ℹ️  No files found in dist directory');
            return 0;
        }

        let fixedFilesCount = 0;
        let processedFiles = 0;
        const errors: Array<{ file: string; error: Error }> = [];

        for (const file of files) {
            try {
                // Only process .js files, skip source maps and other non-JS files
                if (!file.endsWith('.js') || file.endsWith('.map') || file.includes('.d.ts')) {
                    continue;
                }

                const filePath = join(distDir, file);
                processedFiles++;

                // Read file content with error handling
                let originalContent: string;
                try {
                    originalContent = await readFile(filePath, 'utf8');
                } catch (error) {
                    errors.push({ file, error: error as Error });
                    console.warn(`⚠️  Failed to read file ${file}:`, (error as Error).message);
                    continue;
                }

                // Edge case: empty file
                if (originalContent.length === 0) {
                    continue;
                }

                // Apply superior regex patterns with backreferences for quote consistency
                let modifiedContent = originalContent;
                let hasChanges = false;

                // Pattern 1: from 'dayjs/plugin/timezone' or from "dayjs/plugin/timezone"
                const fromPattern = /from (['"])dayjs\/plugin\/(timezone|utc)\1/g;
                const fromMatches = modifiedContent.match(fromPattern);
                if (fromMatches) {
                    modifiedContent = modifiedContent.replace(
                        fromPattern,
                        (_match, quote: string, plugin: string) => {
                            hasChanges = true;
                            return `from ${quote}dayjs/plugin/${plugin}.js${quote}`;
                        },
                    );
                }

                // Pattern 2: import 'dayjs/plugin/timezone' or import "dayjs/plugin/timezone"
                const importPattern = /import (['"])dayjs\/plugin\/(timezone|utc)\1/g;
                const importMatches = modifiedContent.match(importPattern);
                if (importMatches) {
                    modifiedContent = modifiedContent.replace(
                        importPattern,
                        (_match, quote: string, plugin: string) => {
                            hasChanges = true;
                            return `import ${quote}dayjs/plugin/${plugin}.js${quote}`;
                        },
                    );
                }

                // Only write if changes were made and content is different
                if (hasChanges && modifiedContent !== originalContent) {
                    try {
                        await writeFile(filePath, modifiedContent, 'utf8');
                        console.log(`🔧 Fixed dayjs imports in ${file}`);
                        fixedFilesCount++;
                    } catch (error) {
                        errors.push({ file, error: error as Error });
                        console.warn(`⚠️  Failed to write file ${file}:`, (error as Error).message);
                    }
                }
            } catch (error) {
                errors.push({ file, error: error as Error });
                console.warn(`⚠️  Error processing file ${file}:`, (error as Error).message);
            }
        }

        // Summary reporting
        if (processedFiles === 0) {
            console.log('ℹ️  No JavaScript files found to process');
            return 0;
        }

        if (errors.length > 0) {
            console.warn(`⚠️  ${errors.length} file(s) had errors during processing`);
        }

        if (fixedFilesCount > 0) {
            console.log(`✅ Fixed dayjs imports in ${fixedFilesCount} file(s)`);
        } else {
            console.log('ℹ️  No dayjs imports found to fix');
        }

        return fixedFilesCount;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Critical error in fixDayjsImports:', errorMessage);

        // Don't throw in production builds, just log and continue
        if (process.env.NODE_ENV === 'production') {
            console.warn('⚠️  Continuing build despite dayjs import fix errors');
            return 0;
        }

        throw error;
    }
}
