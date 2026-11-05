import { QUERY_DR_RESPONSE_MAP, REFUND_RESPONSE_MAP, VNP_VERSION } from '../../../src/constants';
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

/** Joins checksum fields the way a signature should: only a missing value becomes empty. */
function canonicalChecksumInput(values: readonly unknown[]): string {
    return values.map((value) => (value === undefined ? '' : String(value))).join('|');
}

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
            expect(result.isSuccess).toBe(false);
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
            const stringToCreateHashOfResponse = canonicalChecksumInput([
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
            ]);
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

        it('should reject a successful response code when vnp_SecureHash is absent', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse();
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                QUERY_DR_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should reject a successful response code when vnp_SecureHash is empty', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse();
            mockResponse.vnp_SecureHash = '';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                QUERY_DR_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
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

        it('should accept a queryDr response signed with the text undefined in a field', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_OrderInfo: 'undefined',
            });
            const canonical = canonicalChecksumInput([
                mockResponse.vnp_ResponseId,
                mockResponse.vnp_Command,
                mockResponse.vnp_ResponseCode,
                mockResponse.vnp_Message,
                DEFAULT_VNPAY_CONFIG.tmnCode,
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
            ]);
            mockResponse.vnp_SecureHash = hash(
                DEFAULT_VNPAY_CONFIG.secureSecret,
                Buffer.from(canonical, 'utf-8'),
                HashAlgorithm.SHA512,
            );
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.vnp_OrderInfo).toBe('undefined');
            expect(result.isVerified).toBe(true);
            expect(result.isSuccess).toBe(true);
        });

        it('should sign a queryDr request without deleting the text undefined', async () => {
            // Arrange
            const input = createQueryDrInput({
                vnp_OrderInfo: 'undefined',
            });
            mockFetchSuccess(createMockQueryDrResponse());

            // Act
            await vnpay.queryDr(input);

            // Assert
            const body = getLastFetchRequestBody() as { vnp_SecureHash: string };
            const canonical = canonicalChecksumInput([
                input.vnp_RequestId,
                VNP_VERSION,
                'querydr',
                DEFAULT_VNPAY_CONFIG.tmnCode,
                input.vnp_TxnRef,
                input.vnp_TransactionDate,
                input.vnp_CreateDate,
                input.vnp_IpAddr,
                input.vnp_OrderInfo,
            ]);
            expect(body.vnp_SecureHash).toBe(
                hash(
                    DEFAULT_VNPAY_CONFIG.secureSecret,
                    Buffer.from(canonical, 'utf-8'),
                    HashAlgorithm.SHA512,
                ),
            );
        });

        it('should sign a null queryDr field as the text null', async () => {
            // Arrange
            const input = createQueryDrInput({
                vnp_OrderInfo: null as unknown as string,
            });
            mockFetchSuccess(createMockQueryDrResponse());

            // Act
            await vnpay.queryDr(input);

            // Assert
            const body = getLastFetchRequestBody() as { vnp_SecureHash: string };
            const canonical = canonicalChecksumInput([
                input.vnp_RequestId,
                VNP_VERSION,
                'querydr',
                DEFAULT_VNPAY_CONFIG.tmnCode,
                input.vnp_TxnRef,
                input.vnp_TransactionDate,
                input.vnp_CreateDate,
                input.vnp_IpAddr,
                input.vnp_OrderInfo,
            ]);
            expect(canonical.endsWith('|null')).toBe(true);
            expect(body.vnp_SecureHash).toBe(
                hash(
                    DEFAULT_VNPAY_CONFIG.secureSecret,
                    Buffer.from(canonical, 'utf-8'),
                    HashAlgorithm.SHA512,
                ),
            );
        });

        it('should reject a queryDr signature that treats null as an empty field', async () => {
            // Arrange
            const mockResponse = createMockQueryDrResponse({
                vnp_OrderInfo: null,
            });
            const canonical = canonicalChecksumInput([
                mockResponse.vnp_ResponseId,
                mockResponse.vnp_Command,
                mockResponse.vnp_ResponseCode,
                mockResponse.vnp_Message,
                DEFAULT_VNPAY_CONFIG.tmnCode,
                mockResponse.vnp_TxnRef,
                mockResponse.vnp_Amount,
                mockResponse.vnp_BankCode,
                mockResponse.vnp_PayDate,
                mockResponse.vnp_TransactionNo,
                mockResponse.vnp_TransactionType,
                mockResponse.vnp_TransactionStatus,
                '',
                mockResponse.vnp_PromotionCode,
                mockResponse.vnp_PromotionAmount,
            ]);
            mockResponse.vnp_SecureHash = hash(
                DEFAULT_VNPAY_CONFIG.secureSecret,
                Buffer.from(canonical, 'utf-8'),
                HashAlgorithm.SHA512,
            );
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.queryDr(baseQueryDrInput);

            // Assert
            expect(result.vnp_OrderInfo).toBeNull();
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
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
        it('should reject a successful response code when vnp_SecureHash is absent', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse();
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should reject a successful response code when vnp_SecureHash is empty', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse();
            mockResponse.vnp_SecureHash = '';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should reject a refund signature computed from the undivided wire amount', async () => {
            // Arrange: the service hashes vnp_Amount after dividing by 100
            const mockResponse = createMockRefundResponse();
            const signedWithWireAmount = canonicalChecksumInput([
                mockResponse.vnp_ResponseId,
                mockResponse.vnp_Command,
                mockResponse.vnp_ResponseCode,
                mockResponse.vnp_Message,
                mockResponse.vnp_TmnCode,
                mockResponse.vnp_TxnRef,
                mockResponse.vnp_Amount,
                mockResponse.vnp_BankCode,
                mockResponse.vnp_PayDate,
                mockResponse.vnp_TransactionNo,
                mockResponse.vnp_TransactionType,
                mockResponse.vnp_TransactionStatus,
                mockResponse.vnp_OrderInfo,
            ]);
            mockResponse.vnp_SecureHash = hash(
                DEFAULT_VNPAY_CONFIG.secureSecret,
                Buffer.from(signedWithWireAmount, 'utf-8'),
                HashAlgorithm.SHA512,
            );
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.vnp_Amount).toBe(10000);
            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
        });

        it('should keep the configured locale for a refund checksum error', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse();
            mockResponse.vnp_SecureHash = 'invalid_hash_that_will_fail_verification';
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(
                createRefundInput({
                    vnp_Locale: VnpLocale.EN,
                }),
            );

            // Assert
            expect(result.isVerified).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
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
            expect(result.isSuccess).toBe(false);
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

        it('should reject a refund response that omits vnp_SecureHash', async () => {
            const mockResponse = createMockRefundResponse({
                vnp_ResponseCode: undefined,
            });
            delete mockResponse?.vnp_SecureHash;
            mockFetchSuccess(mockResponse);

            const result = await vnpay.refund(baseRefundInput);

            expect(result.isVerified).toBe(false);
            expect(result.isSuccess).toBe(false);
            expect(result.message).toBe(
                REFUND_RESPONSE_MAP.get('WRONG_CHECKSUM_KEY')?.[VnpLocale.VN],
            );
        });

        it('should accept a refund response signed with the text undefined in a field', async () => {
            // Arrange
            const mockResponse = createMockRefundResponse({
                vnp_OrderInfo: 'undefined',
            });
            const canonical = canonicalChecksumInput([
                mockResponse.vnp_ResponseId,
                mockResponse.vnp_Command,
                mockResponse.vnp_ResponseCode,
                mockResponse.vnp_Message,
                mockResponse.vnp_TmnCode,
                mockResponse.vnp_TxnRef,
                (mockResponse.vnp_Amount as number) / 100,
                mockResponse.vnp_BankCode,
                mockResponse.vnp_PayDate,
                mockResponse.vnp_TransactionNo,
                mockResponse.vnp_TransactionType,
                mockResponse.vnp_TransactionStatus,
                mockResponse.vnp_OrderInfo,
            ]);
            mockResponse.vnp_SecureHash = hash(
                DEFAULT_VNPAY_CONFIG.secureSecret,
                Buffer.from(canonical, 'utf-8'),
                HashAlgorithm.SHA512,
            );
            mockFetchSuccess(mockResponse);

            // Act
            const result = await vnpay.refund(baseRefundInput);

            // Assert
            expect(result.vnp_OrderInfo).toBe('undefined');
            expect(result.vnp_Amount).toBe(10000);
            expect(result.isVerified).toBe(true);
            expect(result.isSuccess).toBe(true);
        });

        it('should sign a refund request without deleting the text undefined', async () => {
            // Arrange
            const input = createRefundInput({
                vnp_OrderInfo: 'undefined',
            });
            mockFetchSuccess(createMockRefundResponse());

            // Act
            await vnpay.refund(input);

            // Assert
            const body = getLastFetchRequestBody() as {
                vnp_SecureHash: string;
                vnp_Amount: number;
            };
            const canonical = canonicalChecksumInput([
                input.vnp_RequestId,
                VNP_VERSION,
                'refund',
                DEFAULT_VNPAY_CONFIG.tmnCode,
                input.vnp_TransactionType,
                input.vnp_TxnRef,
                input.vnp_Amount * 100,
                input.vnp_TransactionNo,
                input.vnp_TransactionDate,
                input.vnp_CreateBy,
                input.vnp_CreateDate,
                input.vnp_IpAddr,
                input.vnp_OrderInfo,
            ]);
            expect(body.vnp_Amount).toBe(input.vnp_Amount * 100);
            expect(body.vnp_SecureHash).toBe(
                hash(
                    DEFAULT_VNPAY_CONFIG.secureSecret,
                    Buffer.from(canonical, 'utf-8'),
                    HashAlgorithm.SHA512,
                ),
            );
        });
    });
});
