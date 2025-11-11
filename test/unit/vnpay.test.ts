import { ignoreLogger } from '../../src/utils';
import { VNPay } from '../../src/vnpay';
import { createTestVNPayInstance, DEFAULT_VNPAY_CONFIG } from '../__helpers__';

describe('VNPay Initialization', () => {
    it('should initialize VNPay instance with default logger', () => {
        // Arrange
        const vnpay = createTestVNPayInstance();

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
    });

    it('should initialize VNPay instance with custom logger', () => {
        // Arrange
        const vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
    });

    it('should initialize VNPay instance with logging disabled', () => {
        // Arrange
        const vnpay = createTestVNPayInstance({
            enableLog: false,
        });

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
    });
});
