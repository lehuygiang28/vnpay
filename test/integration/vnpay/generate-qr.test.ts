import { VnpLocale } from '../../../src/enums';
import { ignoreLogger } from '../../../src/utils';
import {
    createBuildPaymentUrlInput,
    createTestVNPayInstance,
    TEST_CONSTANTS,
} from '../../__helpers__';
import {
    getLastFetchUrl,
    mockFetchError,
    mockFetchReject,
    mockFetchSuccess,
} from '../../__helpers__/mock-helpers';

describe('VNPay.generateQr', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;

    beforeEach(() => {
        vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate QR successfully when VNPay returns code 00', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        const mockQrResponse = {
            code: '00',
            message: 'Success',
            qrcontent: '00020101021226330010A0000007750115HTTCTT2507202315...63040B95',
        };

        mockFetchSuccess(mockQrResponse);

        // Act
        const result = await vnpay.generateQr(input);

        // Assert
        expect(result).toEqual(mockQrResponse);
        expect(result.code).toBe('00');
        expect(result.message).toBe('Success');
        expect(result.qrcontent).toBeDefined();

        const fetchUrl = getLastFetchUrl();
        expect(fetchUrl).toContain('vnp_Command=genqr');
        expect(fetchUrl).toContain(
            `vnp_Amount=${input.vnp_Amount * TEST_CONSTANTS.AMOUNT_MULTIPLIER}`,
        );
    });

    it('should handle API error codes according to the response map', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_Locale: VnpLocale.VN,
        });
        const mockErrorResponse = {
            code: '01',
            message: 'Original Message',
            qrcontent: '',
        };

        mockFetchSuccess(mockErrorResponse);

        // Act
        const result = await vnpay.generateQr(input);

        // Assert
        expect(result.message).toBe('Giao dịch đã tồn tại');
    });

    it('should fallback to default message when VNPay returns an unknown error code', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_Locale: VnpLocale.VN,
        });
        const mockErrorResponse = {
            code: '99',
            message: 'Unknown Error Message',
            qrcontent: '',
        };

        mockFetchSuccess(mockErrorResponse);

        // Act
        const result = await vnpay.generateQr(input);

        // Assert
        expect(result.code).toBe('99');
        expect(result.message).toBe('Giao dịch thất bại');
    });

    it('should throw an error when fetch fails', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        mockFetchError(500);
        await expect(vnpay.generateQr(input)).rejects.toThrow('Failed to generate QR: HTTP 500');
    });

    it('should throw an error when fetch is rejected', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        const errorMessage = 'Network Error';
        mockFetchReject(new Error(errorMessage));

        // Act & Assert
        await expect(vnpay.generateQr(input)).rejects.toThrow(errorMessage);
    });

    it('should throw an error when VNPay returns malformed data', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        mockFetchSuccess({ invalid: 'data' });

        // Act & Assert
        await expect(vnpay.generateQr(input)).rejects.toThrow(
            'Invalid response from VNPay: Missing or malformed data',
        );
    });

    it('should correctly map error message when using English locale', async () => {
        // Arrange
        const input = createBuildPaymentUrlInput({
            vnp_Locale: VnpLocale.EN,
        });
        const mockErrorResponse = {
            code: '01',
            message: 'Original Message',
            qrcontent: '',
        };

        mockFetchSuccess(mockErrorResponse);

        // Act
        const result = await vnpay.generateQr(input);

        // Assert
        expect(result.code).toBe('01');
        expect(result.message).toBe('Transaction is already exist');
    });

    it('should use default locale when vnp_Locale is omitted in input', async () => {
        // Arrange
        const { vnp_Locale: _vnp_Locale, ...inputWithoutLocale } = createBuildPaymentUrlInput();
        const mockErrorResponse = {
            code: '01',
            message: 'Original Message',
            qrcontent: '',
        };

        mockFetchSuccess(mockErrorResponse);

        // Act
        const result = await vnpay.generateQr(inputWithoutLocale);

        // Assert
        expect(result.code).toBe('01');
        expect(result.message).toBe('Giao dịch đã tồn tại');
        expect(vnpay.defaultConfig.vnp_Locale).toBe(VnpLocale.VN);
    });

    it('should log the API result when logger is enabled', async () => {
        // Arrange
        const loggerFn = jest.fn();
        const vnpayWithLogger = createTestVNPayInstance({
            enableLog: true,
            loggerFn,
        });
        const input = createBuildPaymentUrlInput();
        const mockResponse = {
            code: '00',
            message: 'Success',
            qrcontent: 'some_qr_content',
        };

        mockFetchSuccess(mockResponse);

        // Act
        await vnpayWithLogger.generateQr(input);

        // Assert
        expect(loggerFn).toHaveBeenCalledTimes(1);
        expect(loggerFn).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'generateQr',
                code: '00',
                qrcontentLength: 'some_qr_content'.length,
                createdAt: expect.any(Date),
            }),
        );
        expect(loggerFn).toHaveBeenCalledWith(
            expect.not.objectContaining({
                qrcontent: expect.any(String),
            }),
        );
    });
});
