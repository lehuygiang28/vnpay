import { ignoreLogger } from '../../../src/utils';
import { VNPay } from '../../../src/vnpay';
import { createTestVNPayInstance, DEFAULT_VNPAY_CONFIG } from '../../__helpers__';

describe('VNPay Initialization', () => {
    it('should initialize VNPay instance with default logger', () => {
        // Arrange
        const vnpay = createTestVNPayInstance();

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        const url = vnpay.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_TxnRef: 'TXN_INIT_1',
            vnp_OrderInfo: 'Init test 1',
        });
        const u = new URL(url);
        expect(u.searchParams.get('vnp_TmnCode')).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
        expect(u.searchParams.get('vnp_SecureHash')).toBeTruthy();
    });

    it('should initialize VNPay instance with custom logger', () => {
        // Arrange
        const vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        const url = vnpay.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_TxnRef: 'TXN_INIT_2',
            vnp_OrderInfo: 'Init test 2',
        });
        const u = new URL(url);
        expect(u.searchParams.get('vnp_TmnCode')).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
        expect(u.searchParams.get('vnp_SecureHash')).toBeTruthy();
    });

    it('should initialize VNPay instance with logging disabled', () => {
        // Arrange
        const vnpay = createTestVNPayInstance({
            enableLog: false,
        });

        // Act & Assert
        expect(vnpay).toBeInstanceOf(VNPay);
        const url = vnpay.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_TxnRef: 'TXN_INIT_3',
            vnp_OrderInfo: 'Init test 3',
        });
        const u = new URL(url);
        expect(u.searchParams.get('vnp_TmnCode')).toBe(DEFAULT_VNPAY_CONFIG.tmnCode);
        expect(u.searchParams.get('vnp_SecureHash')).toBeTruthy();
    });
});
