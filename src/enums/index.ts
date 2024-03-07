export const UrlService = {
    sandbox: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
} as const;
export type UrlService = (typeof UrlService)[keyof typeof UrlService];

export const VnpCurrCode = {
    VND: 'VND',
} as const;
export type VnpCurrCode = (typeof VnpCurrCode)[keyof typeof VnpCurrCode];

export const VnpLocale = {
    VN: 'vn',
    EN: 'en',
} as const;
export type VnpLocale = (typeof VnpLocale)[keyof typeof VnpLocale];

export const VnpOrderType = {
    OTHER: 'other',
} as const;
export type VnpOrderType = (typeof VnpOrderType)[keyof typeof VnpOrderType];

export const VnpTransactionType = {
    PAYMENT: '01',
    FULL_REFUND: '02',
    PARTIAL_REFUND: '03',
} as const;
export type VnpTransactionType = (typeof VnpTransactionType)[keyof typeof VnpTransactionType];
