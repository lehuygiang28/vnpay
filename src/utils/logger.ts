import * as fs from 'fs';

/**
 * Truyền vào `loggerFn` để bỏ qua logger
 *
 * @en Pass to `loggerFn` for ignoring logger
 * @returns {void}
 */
export function ignoreLogger(): void {}

/**
 * Ghi dữ liệu ra console
 *
 * @en Log data to console
 * @param data - Data to be logged
 */
export function consoleLogger(data: unknown, symbol: keyof Console = 'log'): void {
    if (typeof console[symbol] === 'function') {
        (console[symbol] as (...data: unknown[]) => void)(data);
    }
}

/**
 * Ghi dữ liệu ra file
 *
 * @en Log data to file
 * @param data Data to be logged
 * @param filePath File path to be written
 * @param errorCallback Error callback function
 */
export function fileLogger(data: unknown, filePath: string, errorCallback?: unknown): void {
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    fs.appendFile(filePath, `${dataString}\n`, (err) => {
        if (err && typeof errorCallback === 'function') {
            return errorCallback(err);
        }

        if (err) {
            console.error('Failed to write to file:', err);
            throw err;
        }
    });
}
