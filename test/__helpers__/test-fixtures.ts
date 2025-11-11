import {
    HashAlgorithm,
    ProductCode,
    RefundTransactionType,
    VnpCurrCode,
    VnpLocale,
} from '../../src/enums';
import type {
    Bank,
    BuildPaymentUrl,
    QueryDr,
    Refund,
    ReturnQueryFromVNPay,
    VNPayConfig,
} from '../../src/types';
import { VNPay } from '../../src/vnpay';

/**
 * Default VNPay configuration for tests
 */
export const DEFAULT_VNPAY_CONFIG: VNPayConfig = {
    vnpayHost: 'http://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'http://sandbox.vnpayment.vn',
    tmnCode: 'TEST_TMN_CODE',
    secureSecret: 'test_secret',
    enableLog: true,
    hashAlgorithm: HashAlgorithm.SHA512,
};

/**
 * Creates a VNPay instance with default test configuration
 */
export function createTestVNPayInstance(overrides?: Partial<VNPayConfig>): VNPay {
    return new VNPay({
        ...DEFAULT_VNPAY_CONFIG,
        ...overrides,
    });
}

/**
 * Default BuildPaymentUrl input for tests
 */
export const DEFAULT_BUILD_PAYMENT_URL_INPUT: BuildPaymentUrl = {
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

/**
 * Default QueryDr input for tests
 */
export const DEFAULT_QUERY_DR_INPUT: QueryDr = {
    vnp_RequestId: 'REQUEST123456',
    vnp_TxnRef: 'TXN123456789',
    vnp_TransactionDate: 20231221103000,
    vnp_CreateDate: 20231221103000,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'Test order query',
    vnp_TransactionNo: 14422574,
};

/**
 * Default Refund input for tests
 */
export const DEFAULT_REFUND_INPUT: Refund = {
    vnp_RequestId: 'REFUND123456',
    vnp_TransactionType: RefundTransactionType.FULL_REFUND,
    vnp_TxnRef: 'TXN123456789',
    vnp_Amount: 10000,
    vnp_TransactionDate: 20231221103000,
    vnp_CreateDate: 20231221103000,
    vnp_CreateBy: 'merchant_user',
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'Test refund order',
    vnp_TransactionNo: 14422574,
};

/**
 * Creates a test QueryDr input with optional overrides
 */
export function createQueryDrInput(overrides?: Partial<QueryDr>): QueryDr {
    return {
        ...DEFAULT_QUERY_DR_INPUT,
        ...overrides,
    };
}

/**
 * Creates a test Refund input with optional overrides
 */
export function createRefundInput(overrides?: Partial<Refund>): Refund {
    return {
        ...DEFAULT_REFUND_INPUT,
        ...overrides,
    };
}

/**
 * Creates a test BuildPaymentUrl input with optional overrides
 */
export function createBuildPaymentUrlInput(overrides?: Partial<BuildPaymentUrl>): BuildPaymentUrl {
    return {
        ...DEFAULT_BUILD_PAYMENT_URL_INPUT,
        ...overrides,
    };
}

/**
 * Default ReturnQueryFromVNPay input for tests (used in verifyIpnCall and verifyReturnUrl)
 */
export const DEFAULT_RETURN_QUERY_INPUT: ReturnQueryFromVNPay = {
    vnp_Amount: 1000000,
    vnp_BankCode: 'NCB',
    vnp_BankTranNo: 'VNP14422574',
    vnp_CardType: 'ATM',
    vnp_OrderInfo: 'Thanh toan don hang 2024-05-21T02:17:31.249Z',
    vnp_PayDate: '20240521091806',
    vnp_ResponseCode: '00',
    vnp_TmnCode: 'TEST_TMN_CODE',
    vnp_TransactionNo: '14422574',
    vnp_TransactionStatus: '00',
    vnp_TxnRef: '1716257871703',
    vnp_SecureHash:
        '649982421beb422556a1374713c74e58e716ecbd05007c0c0e1f7effdfaf361dbf146889ca446139afe11b9954c4d5c486e99e3b86fcfab6957f29eb0be72895',
};

/**
 * Creates a test ReturnQueryFromVNPay input with optional overrides
 */
export function createReturnQueryInput(
    overrides?: Partial<ReturnQueryFromVNPay>,
): ReturnQueryFromVNPay {
    return {
        ...DEFAULT_RETURN_QUERY_INPUT,
        ...overrides,
    };
}

/**
 * Default bank list for tests
 */
export const DEFAULT_BANK_LIST: Bank[] = [
    {
        bank_code: 'NCB',
        bank_name: 'NCB Bank',
        logo_link: '/images/ncb.png',
        bank_type: 1,
        display_order: 1,
    },
    {
        bank_code: 'VCB',
        bank_name: 'Vietcombank',
        logo_link: '/images/vcb.png',
        bank_type: 1,
        display_order: 1,
    },
];

/**
 * Test constants
 */
export const TEST_CONSTANTS = {
    AMOUNT_MULTIPLIER: 100,
    DEFAULT_DATE: 20210101070000,
    DEFAULT_TRANSACTION_DATE: 20231221103000,
    INVALID_DATE: 1234567,
    INVALID_AMOUNT_STRING: 'abc',
    AMOUNT_TEST_CASES: [
        [1000000, 10000],
        [2000000, 20000],
        [1650000, 16500],
        [1234500, 12345],
        [123450000, 1234500],
    ] as const,
} as const;
