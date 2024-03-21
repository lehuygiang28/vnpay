import { HashAlgorithm, VnpCurrCode, VnpLocale } from '../enums';

export type VNPayConfig = {
    /**
     * Mã tmn của đối tác
     * @en Merchant tmn code
     */
    tmnCode: string;

    /**
     * Mật khẩu bảo mật của đối tác
     * @en Secure secret of merchant
     */
    secureSecret: string;

    /**
     * Phiên bản của API VNPay
     * @en Version of VNPay API
     */
    vnp_Version?: string;

    /**
     * Đơn vị tiền tệ
     * @en Currency code
     */
    vnp_CurrCode?: VnpCurrCode;

    /**
     * Ngôn ngữ hiển thị trên cổng thanh toán
     * @en Language display on payment gateway
     */
    vnp_Locale?: VnpLocale;

    /**
     * Đường dẫn tới API của VNPay
     * @en API host url of VNPay
     * @default 'https://sandbox.vnpayment.vn'
     * @example 'https://sandbox.vnpayment.vn'
     */
    api_Host?: string;

    /**
     * Payment endpoint API của VNPay
     * @en  Payment endpoint of VNPay
     * @default 'paymentv2/vpcpay.html'
     * @example 'paymentv2/vpcpay.html'
     */
    paymentEndpoint?: string;

    /**
     * Chế độ test
     * @default false
     */
    testMode?: boolean;

    /**
     * Thuật toán mã hóa
     *
     * @en Hash algorithm
     * @default 'SHA512'
     */
    hashAlgorithm?: HashAlgorithm;
};
