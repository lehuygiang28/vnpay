import * as fs from 'fs';
import { consoleLogger, fileLogger, ignoreLogger } from '../../../src/utils/logger';

jest.mock('fs');

describe('Logger', () => {
    let originalConsoleLog: typeof console.log;
    let originalConsoleError: typeof console.error;

    beforeAll(() => {
        // Store original console methods
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console output during tests by mocking with no-op functions
        console.log = jest.fn();
        console.error = jest.fn();
    });

    afterAll(() => {
        // Restore original console methods
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });

    it('should ignore logger', () => {
        // Act
        const result = ignoreLogger();

        // Assert
        expect(result).toBeUndefined();
    });

    it('should log data to console', () => {
        // Arrange
        const logSpy = jest.spyOn(console, 'log').mockImplementation();
        const data = 'test data';

        // Act
        consoleLogger(data);

        // Assert
        expect(logSpy).toHaveBeenCalledWith(data);
        logSpy.mockRestore();
    });

    it('should log data to console with specific symbol', () => {
        // Arrange
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();
        const data = 'test error';

        // Act
        consoleLogger(data, 'error');

        // Assert
        expect(errorSpy).toHaveBeenCalledWith(data);
        errorSpy.mockRestore();
    });

    it('should log data to file', () => {
        // Arrange
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(null));
        const data = { test: 'data' };
        const filePath = 'test.log';

        // Act
        fileLogger(data, filePath);

        // Assert
        expect(appendFileMock).toHaveBeenCalledWith(
            filePath,
            `${JSON.stringify(data)}\n`,
            expect.any(Function),
        );
    });

    it('should handle file write error', () => {
        // Arrange
        const error = new Error('Write file error');
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(error));
        const errorCallback = jest.fn();
        const data = 'test data';
        const filePath = 'test.log';

        // Act
        fileLogger(data, filePath, errorCallback);

        // Assert
        expect(appendFileMock).toHaveBeenCalledWith(filePath, `${data}\n`, expect.any(Function));
        expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should handle file write error without callback', () => {
        // Arrange
        const error = new Error('Write file error');
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(error));
        // Suppress console.error for this test since we're testing error handling
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const data = 'test data';
        const filePath = 'test.log';

        // Act & Assert
        expect(() => fileLogger(data, filePath)).toThrowError(error);
        expect(appendFileMock).toHaveBeenCalledWith(filePath, `${data}\n`, expect.any(Function));
        consoleErrorSpy.mockRestore();
    });
});
