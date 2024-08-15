import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from '../src/enums';
import type { BuildPaymentUrl } from '../src/types';
import { consoleLogger, dateFormat, getDateInGMT7, ignoreLogger } from '../src/utils';
import { VNPay } from '../src/vnpay';

describe('VNPay Initialization', () => {
    it('should initialize VNPay instance with default logger', () => {
        const vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: true,
            hashAlgorithm: HashAlgorithm.SHA512,
        });

        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe('TEST_TMN_CODE');
    });

    it('should initialize VNPay instance with custom logger', () => {
        const vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: true,
            loggerFn: ignoreLogger,
            hashAlgorithm: HashAlgorithm.SHA512,
        });

        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe('TEST_TMN_CODE');
    });

    it('should initialize VNPay instance with logging disabled', () => {
        const vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: false,
            hashAlgorithm: HashAlgorithm.SHA512,
        });

        expect(vnpay).toBeInstanceOf(VNPay);
        expect(vnpay.defaultConfig.vnp_TmnCode).toBe('TEST_TMN_CODE');
    });
});
