import { VnpCurrCode, VnpLocale } from '../enums';

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
     * Chế độ test
     */
    testMode?: boolean;
};
