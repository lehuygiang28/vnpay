import type { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from '../enums';

/**
 * Endpoints configuration for VNPay API
 * Allows overriding individual endpoints when the API changes
 */
export interface EndpointConfig {
    /**
     * Payment endpoint path - defaults to 'paymentv2/vpcpay.html'
     */
    paymentEndpoint?: string;

    /**
     * Query DR and Refund endpoint - defaults to 'merchant_webapi/api/transaction'
     */
    queryDrRefundEndpoint?: string;

    /**
     * Get bank list endpoint - defaults to 'qrpayauth/api/merchant/get_bank_list'
     */
    getBankListEndpoint?: string;
}

/**
 * Strong typing for the configuration of VNPay
 */
export interface VNPayConfig {
    /**
     * VNPay host URL - defaults to sandbox if not provided
     */
    vnpayHost?: string;

    /**
     * queryDr and refund host URL - defaults to sandbox if not provided
     */
    queryDrAndRefundHost?: string;

    /**
     * TMN Code provided by VNPay
     */
    tmnCode: string;

    /**
     * Secure secret provided by VNPay
     */
    secureSecret: string;

    /**
     * VNPay API version - defaults to 2.1.0
     */
    vnp_Version?: string;

    /**
     * Currency code - defaults to VND
     */
    vnp_CurrCode?: VnpCurrCode;

    /**
     * Locale for messages - defaults to Vietnamese
     */
    vnp_Locale?: VnpLocale;

    /**
     * Enable test mode (uses sandbox URL)
     */
    testMode?: boolean;

    /**
     * Hash algorithm to use - defaults to SHA512
     */
    hashAlgorithm?: HashAlgorithm;

    /**
     * Enable logging
     */
    enableLog?: boolean;

    /**
     * Custom logger function
     */
    loggerFn?: (data: unknown) => void;

    /**
     * Default order type - defaults to "other"
     */
    vnp_OrderType?: ProductCode;

    /**
     * Default command - defaults to "pay"
     */
    vnp_Command?: string;

    /**
     * Payment endpoint path - defaults to standard VNPay endpoint
     * @deprecated Use endpoints.paymentEndpoint instead
     */
    paymentEndpoint?: string;

    /**
     * Custom endpoint configuration
     * Use this to override individual endpoints when the VNPay API changes
     */
    endpoints?: EndpointConfig;
}

export interface GlobalConfig extends VNPayConfig {
    vnpayHost: string;
    queryDrAndRefundHost: string;
    vnp_Version: string;
    vnp_CurrCode: VnpCurrCode;
    vnp_Locale: VnpLocale;
    vnp_OrderType: ProductCode;
    vnp_Command: string;
    paymentEndpoint: string;
    endpoints: EndpointConfig;
}
