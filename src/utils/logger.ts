import * as fs from 'fs';

export function consoleLogger(data: unknown): void {
    console.log(data);
}

export function fileLogger(data: unknown, filePath: string): void {
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    fs.appendFile(filePath, dataString + '\n', (err) => {
        if (err) {
            console.error('Failed to write to file:', err);
            throw err;
        }
    });
}
