export * from './product-code.enum';

export enum UrlService {
    sandbox = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
}

export enum HashAlgorithm {
    SHA256 = 'SHA256',
    SHA512 = 'SHA512',
    MD5 = 'MD5',
}

export enum VnpCurrCode {
    VND = 'VND',
}

export enum VnpLocale {
    VN = 'vn',
    EN = 'en',
}

export enum VnpCardType {
    ATM = 'ATM',
    QRCODE = 'QRCODE',
}

export enum VnpTransactionType {
    PAYMENT = '01',
    FULL_REFUND = '02',
    PARTIAL_REFUND = '03',
}

export enum RefundTransactionType {
    FULL_REFUND = '02',
    PARTIAL_REFUND = '03',
}
