import type { LoggerOptions } from '../types/logger.type';
import { consoleLogger, ignoreLogger } from '../utils';

/**
 * Lớp dịch vụ xử lý log cho VNPay
 * @en Logger service class for VNPay
 */
export class LoggerService {
    private isEnabled = false;
    private readonly loggerFn: (data: unknown) => void = ignoreLogger;

    /**
     * Khởi tạo dịch vụ logger
     * @en Initialize logger service
     *
     * @param isEnabled - Cho phép log hay không
     * @en @param isEnabled - Enable logging or not
     *
     * @param customLoggerFn - Hàm logger tùy chỉnh
     * @en @param customLoggerFn - Custom logger function
     */
    constructor(isEnabled = false, customLoggerFn?: (data: unknown) => void) {
        this.isEnabled = isEnabled;
        this.loggerFn = customLoggerFn || (isEnabled ? consoleLogger : ignoreLogger);
    }

    /**
     * Ghi log dữ liệu
     * @en Log data
     *
     * @param data - Dữ liệu cần log
     * @en @param data - Data to log
     *
     * @param options - Tùy chọn log
     * @en @param options - Logging options
     *
     * @param methodName - Tên phương thức gọi log
     * @en @param methodName - Method name that calls the log
     */
    public log<T extends object, LoggerFields extends keyof T>(
        data: T,
        options?: LoggerOptions<T, LoggerFields>,
        methodName?: string,
    ): void {
        if (!this.isEnabled) return;

        const logData = { ...data };

        if (methodName) {
            Object.assign(logData, { method: methodName, createdAt: new Date() });
        }

        if (options?.logger && 'fields' in options.logger) {
            const { type, fields } = options.logger;

            for (const key of Object.keys(logData)) {
                const keyAssert = key as unknown as LoggerFields;
                if (
                    (type === 'omit' && fields.includes(keyAssert)) ||
                    (type === 'pick' && !fields.includes(keyAssert))
                ) {
                    delete logData[keyAssert];
                }
            }
        }

        // Execute logger function
        (options?.logger?.loggerFn || this.loggerFn)(logData);
    }
}
