import { ProductCode, VnpCurrCode, VnpLocale } from '../src/enums';
import type { BuildPaymentUrl } from '../src/types';
import { consoleLogger, dateFormat, getDateInGMT7, ignoreLogger } from '../src/utils';
import { VNPay } from '../src/vnpay';

describe('buildPaymentUrl', () => {
    let vnpay: VNPay;
    let baseInput: BuildPaymentUrl;

    beforeAll(() => {
        vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: true,
            /**
             * Ignore log global, since it's for test only
             * If need test log feature, re-enable it in method scope
             */
            loggerFn: ignoreLogger,
        });
        baseInput = {
            vnp_Amount: 1000,
            vnp_OrderInfo: 'Test order',
            vnp_TxnRef: 'ref1234567',
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_CurrCode: VnpCurrCode.VND,
            vnp_Locale: VnpLocale.VN,
            vnp_OrderType: ProductCode.Other,
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

    it('should handle current create date correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_CreateDate: 20210101070000,
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_CreateDate=20210101070000');
    });

    it('should handle current create date correctly when not provided', () => {
        const { vnp_CreateDate, ...input } = baseInput;
        const currentTime = dateFormat(getDateInGMT7());

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain(`vnp_CreateDate=${currentTime}`);
    });

    it('should handle expired date correctly', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_ExpireDate: 20210101070000,
        };

        const result = vnpay.buildPaymentUrl(input);

        expect(result).toContain('vnp_ExpireDate=20210101070000');
    });

    it('should throw error when `vnp_ExpireDate` is not a valid date', () => {
        const input: BuildPaymentUrl = {
            ...baseInput,
            vnp_ExpireDate: 1234567,
        };

        expect(() => vnpay.buildPaymentUrl(input)).toThrow(Error);
    });

    it('should log the object to the console', () => {
        // Arrange
        const input: BuildPaymentUrl = { ...baseInput };
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        // Act
        vnpay.buildPaymentUrl(input, {
            logger: {
                loggerFn: consoleLogger,
            },
        });

        // Assert
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentUrl: expect.any(String),
                createdAt: expect.any(Date),
                vnp_Amount: expect.any(Number),
            }),
        );
        consoleLogMock.mockRestore();
    });

    it('should log the object with only one field is `paymentUrl`', () => {
        // Arrange
        const input: BuildPaymentUrl = { ...baseInput };
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        // Act
        vnpay.buildPaymentUrl(input, {
            logger: {
                type: 'pick',
                fields: ['paymentUrl'],
                loggerFn(data) {
                    console.log(data);
                },
            },
        });

        // Assert
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({ paymentUrl: expect.any(String) }),
        );
        expect(consoleLogMock).toHaveBeenCalledWith({ paymentUrl: expect.any(String) });
        consoleLogMock.mockRestore();
    });

    it('should log the object with other fields except `paymentUrl`', () => {
        // Arrange
        const input: BuildPaymentUrl = { ...baseInput };
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        // Act
        vnpay.buildPaymentUrl(input, {
            logger: {
                type: 'omit',
                fields: ['paymentUrl'],
                loggerFn(data) {
                    console.log(data);
                },
            },
        });

        // Assert
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.not.objectContaining({ paymentUrl: expect.any(String) }),
        );
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                createdAt: expect.any(Date),
                vnp_TmnCode: expect.any(String),
                vnp_Version: expect.any(String),
                vnp_Locale: expect.any(String),
                vnp_Command: expect.any(String),
                vnp_Amount: expect.any(Number),
            }),
        );
        consoleLogMock.mockRestore();
    });
});
