import type { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from '../enums';

/**
 * Strong typing for the configuration of VNPay
 */
export interface VNPayConfig {
    /**
     * VNPay host URL - defaults to sandbox if not provided
     */
    vnpayHost?: string;

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
     * Payment endpoint path - defaults to standard VNPay endpoint
     */
    paymentEndpoint?: string;

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
}

export interface GlobalConfig extends VNPayConfig {
    vnpayHost: string;
    vnp_Version: string;
    vnp_CurrCode: VnpCurrCode;
    vnp_Locale: VnpLocale;
    vnp_OrderType: ProductCode;
    vnp_Command: string;
    paymentEndpoint: string;
}
