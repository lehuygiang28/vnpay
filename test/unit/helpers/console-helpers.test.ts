import {
    restoreConsoleOutput,
    spyOnConsoleError,
    spyOnConsoleLog,
    suppressConsoleOutput,
} from '../../__helpers__/console-helpers';

describe('console-helpers', () => {
    afterEach(() => {
        // Ensure console is restored after each test
        restoreConsoleOutput();
        jest.restoreAllMocks();
    });

    it('suppressConsoleOutput should replace console methods with mocks and restore should bring them back', () => {
        // Arrange
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        // Act
        suppressConsoleOutput();

        // Assert: suppressed
        expect(jest.isMockFunction(console.log)).toBe(true);
        expect(jest.isMockFunction(console.error)).toBe(true);
        expect(jest.isMockFunction(console.warn)).toBe(true);

        // Act: restore
        restoreConsoleOutput();

        // Assert: restored
        expect(console.log).toBe(originalLog);
        expect(console.error).toBe(originalError);
        expect(console.warn).toBe(originalWarn);
    });

    it('spyOnConsoleLog should create a spy that suppresses output', () => {
        // Act
        const spy = spyOnConsoleLog();
        console.log('hello', { a: 1 });

        // Assert
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('hello', { a: 1 });
    });

    it('spyOnConsoleError should create a spy that suppresses output', () => {
        // Act
        const spy = spyOnConsoleError();
        console.error('oops', new Error('bad'));

        // Assert
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe('oops');
        expect(spy.mock.calls[0][1]).toBeInstanceOf(Error);
    });
});
