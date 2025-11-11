/**
 * Console mocking helpers for tests
 */

let originalConsoleLog: typeof console.log;
let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;

/**
 * Suppresses all console output during tests
 */
export function suppressConsoleOutput(): void {
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;

    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
}

/**
 * Restores original console methods
 */
export function restoreConsoleOutput(): void {
    if (originalConsoleLog) {
        console.log = originalConsoleLog;
    }
    if (originalConsoleError) {
        console.error = originalConsoleError;
    }
    if (originalConsoleWarn) {
        console.warn = originalConsoleWarn;
    }
}

/**
 * Creates a spy on console.log that suppresses output
 */
export function spyOnConsoleLog(): jest.SpyInstance {
    return jest.spyOn(console, 'log').mockImplementation();
}

/**
 * Creates a spy on console.error that suppresses output
 */
export function spyOnConsoleError(): jest.SpyInstance {
    return jest.spyOn(console, 'error').mockImplementation();
}
