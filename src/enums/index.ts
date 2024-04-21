export const UrlService = {
    sandbox: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
} as const;
export type UrlService = (typeof UrlService)[keyof typeof UrlService];

export const HashAlgorithm = {
    SHA256: 'SHA256',
    SHA512: 'SHA512',
    MD5: 'MD5',
} as const;
export type HashAlgorithm = (typeof HashAlgorithm)[keyof typeof HashAlgorithm];

export const VnpCurrCode = {
    VND: 'VND',
} as const;
export type VnpCurrCode = (typeof VnpCurrCode)[keyof typeof VnpCurrCode];

export const VnpLocale = {
    VN: 'vn',
    EN: 'en',
} as const;
export type VnpLocale = (typeof VnpLocale)[keyof typeof VnpLocale];

export enum VnpTransactionType {
    PAYMENT = '01',
    FULL_REFUND = '02',
    PARTIAL_REFUND = '03',
}

export enum RefundTransactionType {
    FULL_REFUND = '02',
    PARTIAL_REFUND = '03',
}
