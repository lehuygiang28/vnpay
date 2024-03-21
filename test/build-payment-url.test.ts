import { VNPay } from '../src/vnpay';
import { VnpLocale, VnpOrderType } from '../src/enums';
import { BuildPaymentUrl } from '../src/types';
import { dateFormat } from '../src/utils';

describe('buildPaymentUrl', () => {
    let vnpay: VNPay;
    let baseInput: BuildPaymentUrl;

    beforeAll(() => {
        vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
        });
        baseInput = {
            vnp_Amount: 1000,
            vnp_OrderInfo: 'Test order',
            vnp_TxnRef: 'ref1234567',
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_CurrCode: 'VND',
            vnp_Locale: VnpLocale.VN,
            vnp_OrderType: VnpOrderType.OTHER,
            vnp_BankCode: 'NCB',
            vnp_CreateDate: 20210101070000,
        };
    });

    it('should return a valid payment URL', () => {
        // Arrange
        const input: BuildPaymentUrl = { ...baseInput };

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain(`vnp_Amount=${input.vnp_Amount * 100}`);
        expect(result).toContain('vnp_OrderInfo=Test+order');
        expect(result).toContain('vnp_TxnRef=ref1234567');
        expect(result).toContain('vnp_IpAddr=127.0.0.1');
        expect(result).toContain('vnp_ReturnUrl=https%3A%2F%2Fexample.com%2Freturn');
        expect(result).toContain('vnp_CreateDate=20210101070000');
        expect(result).toContain('vnp_CurrCode=VND');
        expect(result).toContain('vnp_Locale=vn');
        expect(result).toContain('vnp_OrderType=other');
        expect(result).toContain('vnp_BankCode=NCB');
    });

    it('should handle different amounts correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_Amount: 2000,
            vnp_CreateDate: 20210101070000,
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_Amount=200000');
    });

    it('should handle different order info correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_OrderInfo: 'Different order',
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_OrderInfo=Different+order');
    });

    it('should handle different transaction references correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_TxnRef: 'differentRef',
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_TxnRef=differentRef');
    });

    it('should handle different IP addresses correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_IpAddr: '192.168.0.1',
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_IpAddr=192.168.0.1');
    });

    it('should handle different return URLs correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_ReturnUrl: 'https://different-return-url.com',
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_ReturnUrl=https%3A%2F%2Fdifferent-return-url.com');
    });

    it('should handle different locales correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_Locale: VnpLocale.EN,
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_Locale=en');
    });

    it('should handle different bank codes correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_BankCode: 'HSBC',
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_BankCode=HSBC');
    });

    it('should handle current date correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_CreateDate: 20210101070000,
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_CreateDate=20210101070000');
    });

    it('should handle current date correctly when not provided', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
        };
        delete input.vnp_CreateDate;
        const currentTime = dateFormat(new Date());

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain(`vnp_CreateDate=${currentTime}`);
    });
});
