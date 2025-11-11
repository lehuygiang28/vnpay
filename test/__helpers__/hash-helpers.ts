import { HashAlgorithm } from '../../src/enums';
import { hash } from '../../src/utils';

/**
 * Calculates hash for queryDr response verification
 * Matches the implementation in QueryService.queryDr
 */
export function calculateQueryDrResponseHash(
    responseData: Record<string, unknown>,
    tmnCode: string,
    secureSecret: string,
    hashAlgorithm: HashAlgorithm = HashAlgorithm.SHA512,
): string {
    const stringToHash = [
        responseData.vnp_ResponseId,
        responseData.vnp_Command,
        responseData.vnp_ResponseCode,
        responseData.vnp_Message,
        tmnCode,
        responseData.vnp_TxnRef,
        responseData.vnp_Amount,
        responseData.vnp_BankCode,
        responseData.vnp_PayDate,
        responseData.vnp_TransactionNo,
        responseData.vnp_TransactionType,
        responseData.vnp_TransactionStatus,
        responseData.vnp_OrderInfo,
        responseData.vnp_PromotionCode,
        responseData.vnp_PromotionAmount,
    ]
        .map(String)
        .join('|')
        .replace(/undefined/g, '');

    return hash(secureSecret, Buffer.from(stringToHash, 'utf-8'), hashAlgorithm);
}

/**
 * Calculates hash for refund response verification
 * Matches the implementation in QueryService.refund
 * Note: vnp_Amount is divided by 100 before hash calculation in the service
 */
export function calculateRefundResponseHash(
    responseData: Record<string, unknown>,
    secureSecret: string,
    hashAlgorithm: HashAlgorithm = HashAlgorithm.SHA512,
): string {
    // The service divides vnp_Amount by 100 before calculating hash
    const amountForHash =
        typeof responseData.vnp_Amount === 'number'
            ? responseData.vnp_Amount / 100
            : responseData.vnp_Amount;

    const stringToHash = [
        responseData.vnp_ResponseId,
        responseData.vnp_Command,
        responseData.vnp_ResponseCode,
        responseData.vnp_Message,
        responseData.vnp_TmnCode,
        responseData.vnp_TxnRef,
        amountForHash,
        responseData.vnp_BankCode,
        responseData.vnp_PayDate,
        responseData.vnp_TransactionNo,
        responseData.vnp_TransactionType,
        responseData.vnp_TransactionStatus,
        responseData.vnp_OrderInfo,
    ]
        .map(String)
        .join('|')
        .replace(/undefined/g, '');

    return hash(secureSecret, Buffer.from(stringToHash, 'utf-8'), hashAlgorithm);
}

/**
 * Creates a mock queryDr response with valid hash
 */
export function createMockQueryDrResponse(
    overrides: Partial<Record<string, unknown>> = {},
    tmnCode = 'TEST_TMN_CODE',
    secureSecret = 'test_secret',
): Record<string, unknown> {
    const defaultResponse: Record<string, unknown> = {
        vnp_ResponseId: 'RESPONSE123456',
        vnp_Command: 'querydr',
        vnp_ResponseCode: '00',
        vnp_Message: 'Success',
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: 'TXN123456789',
        vnp_Amount: 1000000,
        vnp_BankCode: 'NCB',
        vnp_PayDate: '20231221103000',
        vnp_TransactionNo: '14422574',
        vnp_TransactionType: '01',
        vnp_TransactionStatus: '00',
        vnp_OrderInfo: 'Test order query',
    };

    const response: Record<string, unknown> = { ...defaultResponse, ...overrides };
    response.vnp_SecureHash = calculateQueryDrResponseHash(
        response,
        tmnCode,
        secureSecret,
        HashAlgorithm.SHA512,
    );

    return response;
}

/**
 * Creates a mock refund response with valid hash
 */
export function createMockRefundResponse(
    overrides: Partial<Record<string, unknown>> = {},
    secureSecret = 'test_secret',
): Record<string, unknown> {
    const defaultResponse: Record<string, unknown> = {
        vnp_ResponseId: 'REFUND_RESPONSE123',
        vnp_Command: 'refund',
        vnp_ResponseCode: '00',
        vnp_Message: 'Success',
        vnp_TmnCode: 'TEST_TMN_CODE',
        vnp_TxnRef: 'TXN123456789',
        vnp_Amount: 1000000,
        vnp_BankCode: 'NCB',
        vnp_PayDate: '20231221103000',
        vnp_TransactionNo: '14422574',
        vnp_TransactionType: '02',
        vnp_TransactionStatus: '00',
        vnp_OrderInfo: 'Test refund order',
    };

    const response: Record<string, unknown> = { ...defaultResponse, ...overrides };
    response.vnp_SecureHash = calculateRefundResponseHash(
        response,
        secureSecret,
        HashAlgorithm.SHA512,
    );

    return response;
}
