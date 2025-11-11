import { VnpLocale } from '../../src/enums';
import { consoleLogger, dateFormat, getDateInGMT7, ignoreLogger } from '../../src/utils';
import {
    createBuildPaymentUrlInput,
    createTestVNPayInstance,
    TEST_CONSTANTS,
} from '../__helpers__';
import { spyOnConsoleLog } from '../__helpers__/console-helpers';

describe('buildPaymentUrl', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;
    let baseInput: ReturnType<typeof createBuildPaymentUrlInput>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });
        baseInput = createBuildPaymentUrlInput();
    });

    it('should return a valid payment URL', () => {
        // Arrange
        const input = createBuildPaymentUrlInput();

        // Act
        const result = vnpay.buildPaymentUrl(input);
        const url = new URL(result);

        // Assert
        expect(url.searchParams.get('vnp_Amount')).toBe(
            String(input.vnp_Amount * TEST_CONSTANTS.AMOUNT_MULTIPLIER),
        );
        expect(url.searchParams.get('vnp_OrderInfo')).toBe(input.vnp_OrderInfo);
        expect(url.searchParams.get('vnp_TxnRef')).toBe(input.vnp_TxnRef);
        expect(url.searchParams.get('vnp_IpAddr')).toBe(input.vnp_IpAddr);
        expect(url.searchParams.get('vnp_ReturnUrl')).toBe(input.vnp_ReturnUrl);
        expect(url.searchParams.get('vnp_CreateDate')).toBe(String(input.vnp_CreateDate));
        expect(url.searchParams.get('vnp_CurrCode')).toBe(input.vnp_CurrCode);
        expect(url.searchParams.get('vnp_Locale')).toBe(
            String(input.vnp_Locale ?? '').toLowerCase(),
        );
        expect(url.searchParams.get('vnp_OrderType')).toBe(
            String(input.vnp_OrderType ?? '').toLowerCase(),
        );
        expect(url.searchParams.get('vnp_BankCode')).toBe(input.vnp_BankCode);
    });

    it('should handle different amounts correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_Amount: 2000,
            vnp_CreateDate: TEST_CONSTANTS.DEFAULT_DATE,
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain(`vnp_Amount=${2000 * TEST_CONSTANTS.AMOUNT_MULTIPLIER}`);
    });

    it('should handle if provide a empty bank code', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_BankCode: '',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).not.toContain('vnp_BankCode');
    });

    it('should handle if not provide a bank code', () => {
        // Arrange
        const { vnp_BankCode: _vnp_BankCode, ...input } = baseInput;

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).not.toContain('vnp_BankCode');
    });

    it('should handle different order info correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_OrderInfo: 'Different order',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);
        const url = new URL(result);

        // Assert
        expect(url.searchParams.get('vnp_OrderInfo')).toBe('Different order');
    });

    it('should handle different transaction references correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_TxnRef: 'differentRef',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain('vnp_TxnRef=differentRef');
    });

    it('should handle different IP addresses correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_IpAddr: '192.168.0.1',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain('vnp_IpAddr=192.168.0.1');
    });

    it('should handle different return URLs correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_ReturnUrl: 'https://different-return-url.com',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);
        const url = new URL(result);

        // Assert
        expect(url.searchParams.get('vnp_ReturnUrl')).toBe('https://different-return-url.com');
    });

    it('should handle different locales correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_Locale: VnpLocale.EN,
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain('vnp_Locale=en');
    });

    it('should handle different bank codes correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_BankCode: 'HSBC',
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain('vnp_BankCode=HSBC');
    });

    it('should handle current create date correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_CreateDate: TEST_CONSTANTS.DEFAULT_DATE,
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain(`vnp_CreateDate=${TEST_CONSTANTS.DEFAULT_DATE}`);
    });

    it('should handle current create date correctly when not provided', () => {
        // Arrange
        const { vnp_CreateDate: _vnp_CreateDate, ...input } = baseInput;
        const currentTime = dateFormat(getDateInGMT7());

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain(`vnp_CreateDate=${currentTime}`);
    });

    it('should handle expired date correctly', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_ExpireDate: TEST_CONSTANTS.DEFAULT_DATE,
        });

        // Act
        const result = vnpay.buildPaymentUrl(input);

        // Assert
        expect(result).toContain(`vnp_ExpireDate=${TEST_CONSTANTS.DEFAULT_DATE}`);
    });

    it('should throw error when `vnp_ExpireDate` is not a valid date', () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_ExpireDate: TEST_CONSTANTS.INVALID_DATE,
        });

        // Act & Assert
        expect(() => vnpay.buildPaymentUrl(input)).toThrow(Error);
    });

    it('should log the object to the console', () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        const consoleLogMock = spyOnConsoleLog();

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
        const input = createBuildPaymentUrlInput();
        const consoleLogMock = spyOnConsoleLog();

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
        const input = createBuildPaymentUrlInput();
        const consoleLogMock = spyOnConsoleLog();

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
