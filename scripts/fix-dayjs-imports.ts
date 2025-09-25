import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

/**
 * Fix dayjs plugin imports in ESM files by adding .js extensions
 * This addresses the ES module resolution issue where Node.js and bundlers
 * require explicit file extensions for imports.
 */
export async function fixDayjsImports() {
    try {
        const distDir = resolve('dist');
        const files = await readdir(distDir);

        let fixedFilesCount = 0;

        for (const file of files) {
            // Only process .js files, skip source maps
            if (!file.endsWith('.js') || file.endsWith('.map')) {
                continue;
            }

            const filePath = join(distDir, file);

            // Read file content once
            const originalContent = await readFile(filePath, 'utf8');

            // Create quote-agnostic regex patterns for both single and double quotes
            const importPatterns = [
                // from 'dayjs/plugin/timezone' or from "dayjs/plugin/timezone"
                /from ['"](dayjs\/plugin\/(timezone|utc))['"]/g,
                // import 'dayjs/plugin/timezone' or import "dayjs/plugin/timezone"
                /import ['"](dayjs\/plugin\/(timezone|utc))['"]/g,
            ];

            // Apply all replacements
            let modifiedContent = originalContent;
            let hasChanges = false;

            for (const pattern of importPatterns) {
                const newContent = modifiedContent.replace(pattern, (match, pluginPath) => {
                    hasChanges = true;
                    return match.replace(pluginPath, `${pluginPath}.js`);
                });

                if (newContent !== modifiedContent) {
                    modifiedContent = newContent;
                }
            }

            // Only write if changes were made
            if (hasChanges) {
                await writeFile(filePath, modifiedContent, 'utf8');
                console.log(`🔧 Fixed dayjs imports in ${file}`);
                fixedFilesCount++;
            }
        }

        if (fixedFilesCount > 0) {
            console.log(`✅ Fixed dayjs imports in ${fixedFilesCount} file(s)`);
        }

        return fixedFilesCount;
    } catch (error) {
        console.error('❌ Error fixing dayjs imports:', error);
        throw error;
    }
}
