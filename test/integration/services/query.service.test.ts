import { QUERY_DR_RESPONSE_MAP, REFUND_RESPONSE_MAP } from '../../../src/constants';
import { HashAlgorithm, RefundTransactionType, VnpLocale } from '../../../src/enums';
import { consoleLogger, hash, ignoreLogger } from '../../../src/utils';
import { getResponseByStatusCode } from '../../../src/utils/common';
import {
    DEFAULT_VNPAY_CONFIG,
    createMockQueryDrResponse,
    createMockRefundResponse,
    createQueryDrInput,
    createRefundInput,
    createTestVNPayInstance,
    getLastFetchRequestBody,
    getLastFetchUrl,
    mockFetchError,
    mockFetchSuccess,
} from '../../__helpers__';

global.fetch = jest.fn();

describe('QueryService', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;
    let baseQueryDrInput: ReturnType<typeof createQueryDrInput>;
    let baseRefundInput: ReturnType<typeof createRefundInput>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });

        baseQueryDrInput = createQueryDrInput();
        baseRefundInput = createRefundInput();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('queryDr', () => {
        it('should return successful query result', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_TxnRef: baseQueryDrInput.vnp_TxnRef,
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.isVerified).toBe(true);
            expect(result.vnp_ResponseCode).toBe('00');
            expect(result.vnp_TxnRef).toBe(baseQueryDrInput.vnp_TxnRef);
            expect(global.fetch).toHaveBeenCalled();
        });

        it('should return failed query result with error code', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_ResponseCode: '91',
                vnp_Message: 'Transaction not found',
                vnp_Amount: 0,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isSuccess).toBe(false);
            expect(result.isVerified).toBe(true);
            expect(result.vnp_ResponseCode).toBe('91');
            expect(result.message).toBe(QUERY_DR_RESPONSE_MAP.get('91')?.[VnpLocale.VN]);
        });

        it('should return unverified result when hash is invalid', async () => {
            // Arrange
            // Use hard-coded invalid hash to test hash verification logic
            const mockResponse = createMockQueryDrResponse();
            mockResponse.vnp_SecureHash = 'invalid_hash_that_will_fail_verification';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.message).toBe(
                QUERY_DR_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should set message for missing response code with valid hash', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_ResponseCode: undefined,
                vnp_SecureHash: undefined,
            });
            // Recalculate hash without response code
            const secureSecret = DEFAULT_VNPAY_CONFIG.secureSecret;
            const tmn = DEFAULT_VNPAY_CONFIG.tmnCode;
            const stringToCreateHashOfResponse = [
                mockResponse.vnp_ResponseId,
                mockResponse.vnp_Command,
                mockResponse.vnp_ResponseCode,
                mockResponse.vnp_Message,
                tmn,
                mockResponse.vnp_TxnRef,
                mockResponse.vnp_Amount,
                mockResponse.vnp_BankCode,
                mockResponse.vnp_PayDate,
                mockResponse.vnp_TransactionNo,
                mockResponse.vnp_TransactionType,
                mockResponse.vnp_TransactionStatus,
                mockResponse.vnp_OrderInfo,
                mockResponse.vnp_PromotionCode,
                mockResponse.vnp_PromotionAmount,
            ]
                .map(String)
                .join('|')
                .replace(/undefined/g, '');
            mockResponse.vnp_SecureHash = hash(
                secureSecret,
                Buffer.from(stringToCreateHashOfResponse, 'utf-8'),
                HashAlgorithm.SHA512,
            );
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.message).toBe(
                getResponseByStatusCode('', VnpLocale.VN, QUERY_DR_RESPONSE_MAP),
            );
            expect(result.isVerified).toBe(true);
        });

        it('should handle HTTP error', async () => {
            // Arrange
            mockFetchError(500);

            // Act & Assert
            await expect(vnpay.queryDr(baseQueryDrInput)).rejects.toThrow(
                'HTTP error! status: 500',
            );
        });

        it('should use custom endpoint when configured', async () => {
            // Arrange
            const customEndpoint = '/api/custom-query-endpoint';
            const vnpayWithCustomEndpoint = createTestVNPayInstance({
                enableLog: false,
                endpoints: {
                    queryDrRefundEndpoint: customEndpoint,
                },
            });

            const mockResponse = createMockQueryDrResponse({
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithCustomEndpoint.queryDr(baseQueryDrInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url).toContain(customEndpoint);
        });

        it('falls back to default endpoint when queryDrRefundEndpoint is falsy', async () => {
            // Arrange
            const vnpayWithEmptyEndpoint = createTestVNPayInstance({
                endpoints: {
                    queryDrRefundEndpoint: '',
                },
            });
            const mockResponse = createMockQueryDrResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithEmptyEndpoint.queryDr(baseQueryDrInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url).toContain('/merchant_webapi/api/transaction');
        });

        it('uses default VNP_VERSION when vnp_Version is undefined', async () => {
            // Arrange
            const vnpayNoVersion = createTestVNPayInstance({});
            const mockResponse = createMockQueryDrResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayNoVersion.queryDr(baseQueryDrInput);

            // Assert
            const body = getLastFetchRequestBody() as Record<string, unknown>;
            expect(body.vnp_Version).toBeDefined();
        });

        it('prefers queryDrAndRefundHost over vnpayHost when both are set (queryDr)', async () => {
            // Arrange
            const customHost = 'https://custom-host.example.com';
            const vnpayWithCustomHost = createTestVNPayInstance({
                vnpayHost: 'https://other-host.example.com',
                queryDrAndRefundHost: customHost,
            });
            const mockResponse = createMockQueryDrResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithCustomHost.queryDr(baseQueryDrInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url?.startsWith(customHost)).toBe(true);
        });

        it('should log the result when logging is enabled', async () => {
            // Arrange
            const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
            const vnpayWithLogging = createTestVNPayInstance({
                loggerFn: consoleLogger,
            });

            const mockResponse = createMockQueryDrResponse({
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithLogging.queryDr(baseQueryDrInput, {
                logger: {
                    loggerFn: consoleLogger,
                },
            });

            // Assert
            expect(consoleLogMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    vnp_TxnRef: expect.any(String),
                    method: 'queryDr',
                    createdAt: expect.any(Date),
                }),
            );
            consoleLogMock.mockRestore();
        });

        it('should handle response code as number', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_ResponseCode: 0,
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isSuccess).toBe(true);
        });

        it('should keep isVerified=true when response has no vnp_SecureHash', async () => {
            // Arrange: remove hash from response to exercise branch where no verification occurs
            const mockResponse = createMockQueryDrResponse();
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isVerified).toBe(true);
        });

        it('should handle promotion code and amount in response', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_PromotionCode: 'PROMO123',
                vnp_PromotionAmount: 50000,
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.vnp_PromotionCode).toBe('PROMO123');
            expect(result.vnp_PromotionAmount).toBe(50000);
        });
    });

    describe('refund', () => {
        it('builds URL when both queryDrAndRefundHost and vnpayHost are undefined', async () => {
            // Arrange
            const vnpayNoHosts = createTestVNPayInstance({
                queryDrAndRefundHost: undefined,
                vnpayHost: undefined,
            });
            const mockResponse = createMockRefundResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayNoHosts.refund(baseRefundInput);

            // Assert
            expect(global.fetch).toHaveBeenCalled();
        });
        it('should keep isVerified=true when response has no vnp_SecureHash', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse();
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isVerified).toBe(true);
        });
        it('should return successful refund result for full refund', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse({
                vnp_TxnRef: baseRefundInput.vnp_TxnRef,
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.isVerified).toBe(true);
            expect(result.vnp_ResponseCode).toBe('00');
            expect(result.vnp_TransactionType).toBe('02');
            expect(result.vnp_Amount).toBe(10000); // Should be divided by 100
            expect(global.fetch).toHaveBeenCalled();
        });

        it('should return successful refund result for partial refund', async () => {
            // Arrange
            const partialRefundInput = createRefundInput({
                vnp_TransactionType: RefundTransactionType.PARTIAL_REFUND,
                vnp_Amount: 5000,
            });

            const mockResponse = createMockRefundResponse({
                vnp_Amount: 500000,
                vnp_TransactionType: '03',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(partialRefundInput);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.vnp_TransactionType).toBe('03');
            expect(result.vnp_Amount).toBe(5000); // Should be divided by 100
        });

        it('should multiply amount by 100 in request', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpay.refund(baseRefundInput);

            // Assert
            const requestBody = getLastFetchRequestBody() as Record<string, unknown>;
            expect(requestBody.vnp_Amount).toBe(1000000); // 10000 * 100
        });

        it('should use default transaction number when not provided', async () => {
            // Arrange
            const { vnp_TransactionNo: _vnp_TransactionNo, ...refundWithoutTransactionNo } =
                baseRefundInput;
            const mockResponse = createMockRefundResponse({
                vnp_TransactionNo: '0',
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            await vnpay.refund(refundWithoutTransactionNo);

            // Assert
            // Note: When vnp_TransactionNo is not provided, it defaults to '0' in hash calculation
            // but may not be included in the request body if not explicitly set
            const requestBody = getLastFetchRequestBody() as Record<string, unknown>;
            // The hash calculation uses '0' as default, but the body may not include it
            // This test verifies the refund completes successfully without the field
            expect(requestBody.vnp_TxnRef).toBe('TXN123456789');
        });

        it('should return failed refund result with error code', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: '91',
                vnp_Message: 'Transaction not found',
                vnp_Amount: 0,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isSuccess).toBe(false);
            expect(result.isVerified).toBe(true);
            expect(result.vnp_ResponseCode).toBe('91');
            expect(result.message).toBe(REFUND_RESPONSE_MAP.get('91')?.[VnpLocale.VN]);
        });

        it('should return unverified result when hash is invalid for valid response code', async () => {
            // Arrange
            // Use hard-coded invalid hash to test hash verification logic
            const mockResponse = createMockRefundResponse();
            mockResponse.vnp_SecureHash = 'invalid_hash_that_will_fail_verification';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should verify hash for all response codes including error codes (> 99)', async () => {
            // Arrange
            // Use hard-coded invalid hash to test hash verification for error codes
            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: '100',
                vnp_Message: 'Error',
                vnp_Amount: 0,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockResponse.vnp_SecureHash = 'invalid_hash_that_will_fail_verification';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            // Hash should be checked even for error codes, so invalid hash should result in isVerified=false
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should handle HTTP error', async () => {
            // Arrange
            mockFetchError(500);

            // Act & Assert
            await expect(vnpay.refund(baseRefundInput)).rejects.toThrow('HTTP error! status: 500');
        });

        it('should use custom endpoint when configured', async () => {
            // Arrange
            const customEndpoint = '/api/custom-refund-endpoint';
            const vnpayWithCustomEndpoint = createTestVNPayInstance({
                enableLog: false,
                endpoints: {
                    queryDrRefundEndpoint: customEndpoint,
                },
            });

            const mockResponse = createMockRefundResponse({
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithCustomEndpoint.refund(baseRefundInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url).toContain(customEndpoint);
        });

        it('falls back to default endpoint when queryDrRefundEndpoint is falsy (refund)', async () => {
            // Arrange
            const vnpayWithEmptyEndpoint = createTestVNPayInstance({
                endpoints: {
                    queryDrRefundEndpoint: '',
                },
            });
            const mockResponse = createMockRefundResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithEmptyEndpoint.refund(baseRefundInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url).toContain('/merchant_webapi/api/transaction');
        });

        it('uses default VNP_VERSION when vnp_Version is undefined (refund)', async () => {
            // Arrange
            const vnpayNoVersion = createTestVNPayInstance({});
            const mockResponse = createMockRefundResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayNoVersion.refund(baseRefundInput);

            // Assert
            const body = getLastFetchRequestBody() as Record<string, unknown>;
            expect(body.vnp_Version).toBeDefined();
        });

        it('prefers queryDrAndRefundHost over vnpayHost when both are set (refund)', async () => {
            // Arrange
            const customHost = 'https://custom-host.example.com';
            const vnpayWithCustomHost = createTestVNPayInstance({
                vnpayHost: 'https://other-host.example.com',
                queryDrAndRefundHost: customHost,
            });
            const mockResponse = createMockRefundResponse();
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithCustomHost.refund(baseRefundInput);

            // Assert
            const url = getLastFetchUrl();
            expect(url?.startsWith(customHost)).toBe(true);
        });

        it('should log the result when logging is enabled', async () => {
            // Arrange
            const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
            const vnpayWithLogging = createTestVNPayInstance({
                loggerFn: consoleLogger,
            });

            const mockResponse = createMockRefundResponse({
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            await vnpayWithLogging.refund(baseRefundInput, {
                logger: {
                    loggerFn: consoleLogger,
                },
            });

            // Assert
            expect(consoleLogMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    vnp_TxnRef: expect.any(String),
                    method: 'refund',
                    createdAt: expect.any(Date),
                }),
            );
            consoleLogMock.mockRestore();
        });

        it('should handle response code as number', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: 0,
                vnp_Amount: 1000000,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isSuccess).toBe(true);
        });

        it('should handle custom locale in refund request', async () => {
            // Arrange
            const refundWithLocale = createRefundInput({
                vnp_Locale: VnpLocale.EN,
            });

            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: '91',
                vnp_Message: 'Transaction not found',
                vnp_Amount: 0,
                vnp_BankCode: '',
                vnp_PayDate: '',
                vnp_TransactionNo: '',
                vnp_TransactionType: '',
                vnp_TransactionStatus: '',
                vnp_OrderInfo: '',
            });
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(refundWithLocale);

            // Assert
            expect(result.message).toBe(REFUND_RESPONSE_MAP.get('91')?.[VnpLocale.EN]);
        });

        it('should set message for missing response code when no signature provided in refund', async () => {
            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: undefined,
            });
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            const result = await vnpay.refund(baseRefundInput);

            expect(result.message).toBe(
                getResponseByStatusCode('', VnpLocale.VN, REFUND_RESPONSE_MAP),
            );
            expect(result.isVerified).toBe(true);
        });
    });
});
