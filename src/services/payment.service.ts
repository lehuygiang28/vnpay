import { RESPONSE_MAP } from '../constants/response-map.constant';
import { type HashAlgorithm } from '../enums';
import type {
    BuildPaymentUrl,
    BuildPaymentUrlLogger,
    BuildPaymentUrlOptions,
    DefaultConfig,
    GenerateQrResponse,
    GenerateQrResponseLogger,
    GenerateQrResponseOptions,
    GlobalConfig,
} from '../types';
import {
    dateFormat,
    getDateInGMT7,
    getResponseByStatusCode,
    isValidVnpayDateFormat,
} from '../utils/common';
import { calculateSecureHash, createPaymentUrl } from '../utils/payment.util';
import type { LoggerService } from './logger.service';

/**
 * Dịch vụ xử lý thanh toán của VNPay
 * @en Payment service for VNPay
 */
export class PaymentService {
    private readonly config: GlobalConfig;
    private readonly defaultConfig: DefaultConfig;
    private readonly logger: LoggerService;
    private readonly hashAlgorithm: HashAlgorithm;
    private readonly bufferEncode: BufferEncoding = 'utf-8';

    /**
     * Khởi tạo dịch vụ thanh toán
     * @en Initialize payment service
     *
     * @param config - Cấu hình VNPay
     * @en @param config - VNPay configuration
     *
     * @param logger - Dịch vụ logger
     * @en @param logger - Logger service
     *
     * @param hashAlgorithm - Thuật toán băm
     * @en @param hashAlgorithm - Hash algorithm
     */
    constructor(config: GlobalConfig, logger: LoggerService, hashAlgorithm: HashAlgorithm) {
        this.config = config;
        this.hashAlgorithm = hashAlgorithm;
        this.logger = logger;

        this.defaultConfig = {
            vnp_TmnCode: config.tmnCode,
            vnp_Version: config.vnp_Version,
            vnp_CurrCode: config.vnp_CurrCode,
            vnp_Locale: config.vnp_Locale,
            vnp_Command: config.vnp_Command,
            vnp_OrderType: config.vnp_OrderType,
        };
    }

    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Thông tin thanh toán
     * @en @param {BuildPaymentUrl} data - Payment information
     *
     * @param {BuildPaymentUrlOptions<LoggerFields>} options - Tùy chọn
     * @en @param {BuildPaymentUrlOptions<LoggerFields>} options - Options
     *
     * @returns {string} - URL thanh toán
     * @en @returns {string} - Payment URL
     */
    public buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(
        data: BuildPaymentUrl,
        options?: BuildPaymentUrlOptions<LoggerFields>,
    ): string {
        const { url, dataToBuild } = this.buildVnpayUrlInternal(data);

        // Log if enabled
        const data2Log: BuildPaymentUrlLogger = {
            createdAt: new Date(),
            method: 'buildPaymentUrl',
            paymentUrl: options?.withHash
                ? url.toString()
                : (() => {
                      const cloneUrl = new URL(url.toString());
                      cloneUrl.searchParams.delete('vnp_SecureHash');
                      return cloneUrl.toString();
                  })(),
            ...dataToBuild,
        };

        this.logger.log(data2Log, options, 'buildPaymentUrl');

        return url.toString();
    }

    /**
     * Phương thức xây dựng, tạo thành qr thanh toán của VNPay
     * @en Build the qr payment
     *
     * @param {BuildPaymentUrl} data - Thông tin thanh toán
     * @en @param {BuildPaymentUrl} data - Payment information
     *
     * @param {GenerateQrResponseOptions<LoggerFields>} options - Tùy chọn
     * @en @param {GenerateQrResponseOptions<LoggerFields>} options - Options
     *
     * @returns {Promise<GenerateQrResponse>} - Kết quả QR Pay
     * @en @returns {Promise<GenerateQrResponse>} - QR Pay result
     */
    public async generateQr<LoggerFields extends keyof GenerateQrResponseLogger>(
        data: BuildPaymentUrl,
        options?: GenerateQrResponseOptions<LoggerFields>,
    ): Promise<GenerateQrResponse> {
        const { url } = this.buildVnpayUrlInternal(data, { vnp_Command: 'genqr' });

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Failed to generate QR: HTTP ${response.status}`);
        }

        const result = (await response.json()) as GenerateQrResponse;

        if (result.code !== '00') {
            const locale = data.vnp_Locale || this.defaultConfig.vnp_Locale;
            result.message = getResponseByStatusCode(result.code, locale, RESPONSE_MAP);
        }

        const data2Log: GenerateQrResponseLogger = {
            createdAt: new Date(),
            method: 'generateQr',
            ...result,
        };

        this.logger.log(data2Log, options, 'generateQr');

        return result;
    }

    private buildVnpayUrlInternal(
        data: BuildPaymentUrl,
        overrides?: Partial<DefaultConfig & BuildPaymentUrl>,
    ): { url: URL; dataToBuild: DefaultConfig & BuildPaymentUrl } {
        const dataToBuild = {
            ...this.defaultConfig,
            ...data,
            ...overrides,

            // Multiply by 100 to follow VNPay standard
            vnp_Amount: data.vnp_Amount * 100,
        };

        if (dataToBuild?.vnp_ExpireDate && !isValidVnpayDateFormat(dataToBuild.vnp_ExpireDate)) {
            throw new Error(
                'Invalid vnp_ExpireDate format. Use `dateFormat` utility function to format it',
            );
        }

        if (!isValidVnpayDateFormat(dataToBuild?.vnp_CreateDate ?? 0)) {
            const timeGMT7 = getDateInGMT7();
            dataToBuild.vnp_CreateDate = dateFormat(timeGMT7, 'yyyyMMddHHmmss');
        }

        const redirectUrl = createPaymentUrl({
            config: this.config,
            data: dataToBuild,
        });

        const signed = calculateSecureHash({
            secureSecret: this.config.secureSecret,
            data: redirectUrl.search.slice(1).toString(),
            hashAlgorithm: this.hashAlgorithm,
            bufferEncode: this.bufferEncode,
        });
        redirectUrl.searchParams.append('vnp_SecureHash', signed);

        return {
            url: redirectUrl,
            dataToBuild: dataToBuild,
        };
    }
}
