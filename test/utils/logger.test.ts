import * as fs from 'fs';
import { consoleLogger, fileLogger, ignoreLogger } from '../../src/utils/logger';

jest.mock('fs');

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should ignore logger', () => {
        expect(ignoreLogger()).toBeUndefined();
    });

    it('should log data to console', () => {
        const logSpy = jest.spyOn(console, 'log');
        const data = 'test data';
        consoleLogger(data);
        expect(logSpy).toHaveBeenCalledWith(data);
    });

    it('should log data to console with specific symbol', () => {
        const errorSpy = jest.spyOn(console, 'error');
        const data = 'test error';
        consoleLogger(data, 'error');
        expect(errorSpy).toHaveBeenCalledWith(data);
    });

    it('should log data to file', () => {
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(null));
        const data = { test: 'data' };
        const filePath = 'test.log';
        fileLogger(data, filePath);
        expect(appendFileMock).toHaveBeenCalledWith(
            filePath,
            `${JSON.stringify(data)}\n`,
            expect.any(Function),
        );
    });

    it('should handle file write error', () => {
        const error = new Error('Write file error');
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(error));
        const errorCallback = jest.fn();
        const data = 'test data';
        const filePath = 'test.log';
        fileLogger(data, filePath, errorCallback);
        expect(appendFileMock).toHaveBeenCalledWith(filePath, `${data}\n`, expect.any(Function));
        expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should handle file write error without callback', () => {
        const error = new Error('Write file error');
        const appendFileMock = jest
            .spyOn(fs, 'appendFile')
            .mockImplementation((_path, _data, callback) => callback(error));
        const data = 'test data';
        const filePath = 'test.log';
        expect(() => fileLogger(data, filePath)).toThrowError(error);
        expect(appendFileMock).toHaveBeenCalledWith(filePath, `${data}\n`, expect.any(Function));
    });
});
