import { LoggerService } from '../../../src/services/logger.service';

describe('LoggerService', () => {
    let loggerService: LoggerService;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    describe('Constructor', () => {
        it('should initialize with logging disabled by default', () => {
            // Arrange
            loggerService = new LoggerService();
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData);

            // Assert
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should initialize with logging enabled', () => {
            // Arrange
            loggerService = new LoggerService(true);
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData);

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(testData);
        });

        it('should use custom logger function when provided', () => {
            // Arrange
            const customLogger = jest.fn();
            loggerService = new LoggerService(true, customLogger);
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData);

            // Assert
            expect(customLogger).toHaveBeenCalledWith(testData);
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should use consoleLogger when enabled and no custom logger provided', () => {
            // Arrange
            loggerService = new LoggerService(true);
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData);

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(testData);
        });
    });

    describe('log method', () => {
        beforeEach(() => {
            loggerService = new LoggerService(true);
        });

        it('should not log when logging is disabled', () => {
            // Arrange
            loggerService = new LoggerService(false);
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData);

            // Assert
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it('should log data when logging is enabled', () => {
            // Arrange
            const testData = { test: 'data', value: 123 };

            // Act
            loggerService.log(testData);

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(testData);
        });

        it('should add method name and createdAt when methodName is provided', () => {
            // Arrange
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData, undefined, 'testMethod');

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    test: 'data',
                    method: 'testMethod',
                    createdAt: expect.any(Date),
                }),
            );
        });

        it('should use custom logger function from options', () => {
            // Arrange
            const customLogger = jest.fn();
            const testData = { test: 'data' };

            // Act
            loggerService.log(testData, {
                logger: {
                    type: 'all',
                    loggerFn: customLogger,
                },
            });

            // Assert
            expect(customLogger).toHaveBeenCalledWith(testData);
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        describe('omit type', () => {
            it('should omit specified fields when type is omit', () => {
                // Arrange
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'omit',
                        fields: ['field2'],
                    },
                });

                // Assert
                expect(consoleLogSpy).toHaveBeenCalledWith({
                    field1: 'value1',
                    field3: 'value3',
                });
            });

            it('should omit multiple fields when type is omit', () => {
                // Arrange
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                    field4: 'value4',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'omit',
                        fields: ['field2', 'field4'],
                    },
                });

                // Assert
                expect(consoleLogSpy).toHaveBeenCalledWith({
                    field1: 'value1',
                    field3: 'value3',
                });
            });

            it('should use custom logger function with omitted fields', () => {
                // Arrange
                const customLogger = jest.fn();
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'omit',
                        fields: ['field2'],
                        loggerFn: customLogger,
                    },
                });

                // Assert
                expect(customLogger).toHaveBeenCalledWith({ field1: 'value1' });
            });
        });

        describe('pick type', () => {
            it('should pick only specified fields when type is pick', () => {
                // Arrange
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'pick',
                        fields: ['field1', 'field3'],
                    },
                });

                // Assert
                expect(consoleLogSpy).toHaveBeenCalledWith({
                    field1: 'value1',
                    field3: 'value3',
                });
            });

            it('should pick single field when type is pick', () => {
                // Arrange
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'pick',
                        fields: ['field1'],
                    },
                });

                // Assert
                expect(consoleLogSpy).toHaveBeenCalledWith({ field1: 'value1' });
            });

            it('should use custom logger function with picked fields', () => {
                // Arrange
                const customLogger = jest.fn();
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'pick',
                        fields: ['field1'],
                        loggerFn: customLogger,
                    },
                });

                // Assert
                expect(customLogger).toHaveBeenCalledWith({ field1: 'value1' });
            });
        });

        describe('all type', () => {
            it('should log all fields when type is all', () => {
                // Arrange
                const testData = {
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3',
                };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'all',
                    },
                });

                // Assert
                expect(consoleLogSpy).toHaveBeenCalledWith(testData);
            });

            it('should use custom logger function when type is all', () => {
                // Arrange
                const customLogger = jest.fn();
                const testData = { test: 'data' };

                // Act
                loggerService.log(testData, {
                    logger: {
                        type: 'all',
                        loggerFn: customLogger,
                    },
                });

                // Assert
                expect(customLogger).toHaveBeenCalledWith(testData);
            });
        });

        it('should combine methodName with omit type', () => {
            // Arrange
            const testData = { field1: 'value1', field2: 'value2' };

            // Act
            loggerService.log(
                testData,
                {
                    logger: {
                        type: 'omit',
                        fields: ['field2'],
                    },
                },
                'testMethod',
            );

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field1: 'value1',
                    method: 'testMethod',
                    createdAt: expect.any(Date),
                }),
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.not.objectContaining({ field2: 'value2' }),
            );
        });

        it('should combine methodName with pick type', () => {
            // Arrange
            const testData: Record<string, string> = {
                field1: 'value1',
                field2: 'value2',
            };

            // Act
            loggerService.log(
                testData,
                {
                    logger: {
                        type: 'pick',
                        fields: ['field1', 'method', 'createdAt'],
                    },
                },
                'testMethod',
            );

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    field1: 'value1',
                    method: 'testMethod',
                    createdAt: expect.any(Date),
                }),
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.not.objectContaining({ field2: 'value2' }),
            );
        });

        it('should handle empty fields array with omit type', () => {
            // Arrange
            const testData = { field1: 'value1', field2: 'value2' };

            // Act
            loggerService.log(testData, {
                logger: {
                    type: 'omit',
                    fields: [],
                },
            });

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(testData);
        });

        it('should handle empty fields array with pick type', () => {
            // Arrange
            const testData = { field1: 'value1', field2: 'value2' };

            // Act
            loggerService.log(testData, {
                logger: {
                    type: 'pick',
                    fields: [],
                },
            });

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith({});
        });

        it('should handle non-existent fields in omit type', () => {
            // Arrange
            const testData: Record<string, string> = { field1: 'value1' };

            // Act
            loggerService.log(testData, {
                logger: {
                    type: 'omit',
                    fields: ['nonExistentField'],
                },
            });

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(testData);
        });

        it('should handle non-existent fields in pick type', () => {
            // Arrange
            const testData: Record<string, string> = { field1: 'value1' };

            // Act
            loggerService.log(testData, {
                logger: {
                    type: 'pick',
                    fields: ['nonExistentField'],
                },
            });

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith({});
        });
    });
});
