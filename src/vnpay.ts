import {
    GET_BANK_LIST_ENDPOINT,
    PAYMENT_ENDPOINT,
    QUERY_DR_REFUND_ENDPOINT,
    VNPAY_GATEWAY_SANDBOX_HOST,
    VNP_DEFAULT_COMMAND,
    VNP_VERSION,
} from './constants';
import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from './enums';
import { LoggerService } from './services/logger.service';
import { PaymentService } from './services/payment.service';
import { QueryService } from './services/query.service';
import { VerificationService } from './services/verification.service';
import type {
    Bank,
    BuildPaymentUrl,
    BuildPaymentUrlLogger,
    BuildPaymentUrlOptions,
    DefaultConfig,
    EndpointConfig,
    GlobalConfig,
    QueryDr,
    QueryDrResponse,
    QueryDrResponseLogger,
    QueryDrResponseOptions,
    Refund,
    RefundOptions,
    RefundResponse,
    RefundResponseLogger,
    ReturnQueryFromVNPay,
    VNPayConfig,
    VerifyIpnCall,
    VerifyIpnCallLogger,
    VerifyIpnCallOptions,
    VerifyReturnUrl,
    VerifyReturnUrlLogger,
    VerifyReturnUrlOptions,
} from './types';
import { resolveUrlString } from './utils/common';

/**
 * Lớp hỗ trợ thanh toán qua VNPay
 * @en VNPay class to support VNPay payment
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = new VNPay({
 *     vnpayHost: 'https://sandbox.vnpayment.vn',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 *     testMode: true, // optional
 *     hashAlgorithm: 'SHA512', // optional
 *     // Using new endpoints configuration
 *     endpoints: {
 *       paymentEndpoint: 'paymentv2/vpcpay.html',
 *       queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
 *       getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
 *     }
 * });
 *
 * const tnx = '12345678'; // Generate your own transaction code
 * const urlString = vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *     vnp_IpAddr: '192.168.0.1',
 *     vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *     vnp_TxnRef: tnx,
 *     vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 *
 */
export class VNPay {
    private readonly globalConfig: GlobalConfig;
    private readonly hashAlgorithm: HashAlgorithm;

    // Service instances
    private readonly loggerService: LoggerService;
    private readonly paymentService: PaymentService;
    private readonly verificationService: VerificationService;
    private readonly queryService: QueryService;

    /**
     * Khởi tạo đối tượng VNPay
     * @en Initialize VNPay instance
     *
     * @param {VNPayConfig} config - VNPay configuration
     */
    constructor({
        vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST,
        queryDrAndRefundHost = VNPAY_GATEWAY_SANDBOX_HOST,
        vnp_Version = VNP_VERSION,
        vnp_CurrCode = VnpCurrCode.VND,
        vnp_Locale = VnpLocale.VN,
        testMode = false,
        paymentEndpoint = PAYMENT_ENDPOINT,
        endpoints = {},
        ...config
    }: VNPayConfig) {
        if (testMode) {
            vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST;
            queryDrAndRefundHost = VNPAY_GATEWAY_SANDBOX_HOST;
        }

        this.hashAlgorithm = config?.hashAlgorithm ?? HashAlgorithm.SHA512;

        // Initialize endpoints with defaults and overrides
        const initializedEndpoints: EndpointConfig = {
            paymentEndpoint: endpoints.paymentEndpoint || paymentEndpoint,
            queryDrRefundEndpoint: endpoints.queryDrRefundEndpoint || QUERY_DR_REFUND_ENDPOINT,
            getBankListEndpoint: endpoints.getBankListEndpoint || GET_BANK_LIST_ENDPOINT,
        };

        this.globalConfig = {
            vnpayHost,
            vnp_Version,
            vnp_CurrCode,
            vnp_Locale,
            vnp_OrderType: ProductCode.Other,
            vnp_Command: VNP_DEFAULT_COMMAND,
            paymentEndpoint: initializedEndpoints.paymentEndpoint as string,
            endpoints: initializedEndpoints,
            queryDrAndRefundHost,
            ...config,
        };

        this.loggerService = new LoggerService(config?.enableLog ?? false, config?.loggerFn);

        this.paymentService = new PaymentService(
            this.globalConfig,
            this.loggerService,
            this.hashAlgorithm,
        );

        this.verificationService = new VerificationService(
            this.globalConfig,
            this.loggerService,
            this.hashAlgorithm,
        );

        this.queryService = new QueryService(
            this.globalConfig,
            this.loggerService,
            this.hashAlgorithm,
        );
    }

    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     *
     * @returns {DefaultConfig} Cấu hình mặc định
     * @en @returns {DefaultConfig} Default configuration
     */
    public get defaultConfig(): DefaultConfig {
        return {
            vnp_TmnCode: this.globalConfig.tmnCode,
            vnp_Version: this.globalConfig.vnp_Version,
            vnp_CurrCode: this.globalConfig.vnp_CurrCode,
            vnp_Locale: this.globalConfig.vnp_Locale,
            vnp_Command: this.globalConfig.vnp_Command,
            vnp_OrderType: this.globalConfig.vnp_OrderType,
        };
    }

    /**
     * Lấy danh sách ngân hàng được hỗ trợ bởi VNPay
     * @en Get list of banks supported by VNPay
     *
     * @returns {Promise<Bank[]>} Danh sách ngân hàng
     * @en @returns {Promise<Bank[]>} List of banks
     */
    public async getBankList(): Promise<Bank[]> {
        const response = await fetch(
            resolveUrlString(
                this.globalConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                this.globalConfig.endpoints.getBankListEndpoint as string,
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tmn_code=${this.globalConfig.tmnCode}`,
            },
        );

        const bankList = (await response.json()) as Bank[];

        for (const bank of bankList) {
            bank.logo_link = resolveUrlString(
                this.globalConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                bank.logo_link.slice(1),
            );
        }

        return bankList;
    }

    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Dữ liệu thanh toán cần thiết để tạo URL
     * @en @param {BuildPaymentUrl} data - Payment data required to create URL
     *
     * @param {BuildPaymentUrlOptions<LoggerFields>} options - Tùy chọn bổ sung
     * @en @param {BuildPaymentUrlOptions<LoggerFields>} options - Additional options
     *
     * @returns {string} URL thanh toán
     * @en @returns {string} Payment URL
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
     */
    public buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(
        data: BuildPaymentUrl,
        options?: BuildPaymentUrlOptions<LoggerFields>,
    ): string {
        return this.paymentService.buildPaymentUrl(data, options);
    }

    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
     * @en @param {ReturnQueryFromVNPay} query - The object of data returned from VNPay
     *
     * @param {VerifyReturnUrlOptions<LoggerFields>} options - Tùy chọn để xác thực
     * @en @param {VerifyReturnUrlOptions<LoggerFields>} options - Options for verification
     *
     * @returns {VerifyReturnUrl} Kết quả xác thực
     * @en @returns {VerifyReturnUrl} Verification result
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
     */
    public verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(
        query: ReturnQueryFromVNPay,
        options?: VerifyReturnUrlOptions<LoggerFields>,
    ): VerifyReturnUrl {
        return this.verificationService.verifyReturnUrl(query, options);
    }

    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     *
     * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay,
     * kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
     *
     * Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`
     *
     * @en Method to verify the ipn call from VNPay
     *
     * After receiving the call, the merchant system needs to verify the data received from VNPay,
     * check if the order is valid, check if the payment amount is correct.
     *
     * Then respond to VNPay the verification result through `IpnResponse`
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu từ VNPay qua IPN
     * @en @param {ReturnQueryFromVNPay} query - The object of data from VNPay via IPN
     *
     * @param {VerifyIpnCallOptions<LoggerFields>} options - Tùy chọn để xác thực
     * @en @param {VerifyIpnCallOptions<LoggerFields>} options - Options for verification
     *
     * @returns {VerifyIpnCall} Kết quả xác thực
     * @en @returns {VerifyIpnCall} Verification result
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url
     */
    public verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(
        query: ReturnQueryFromVNPay,
        options?: VerifyIpnCallOptions<LoggerFields>,
    ): VerifyIpnCall {
        return this.verificationService.verifyIpnCall(query, options);
    }

    /**
     * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
     * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
     *
     * @param {QueryDr} query - Dữ liệu truy vấn kết quả thanh toán
     * @en @param {QueryDr} query - The data to query payment result
     *
     * @param {QueryDrResponseOptions<LoggerFields>} options - Tùy chọn truy vấn
     * @en @param {QueryDrResponseOptions<LoggerFields>} options - Query options
     *
     * @returns {Promise<QueryDrResponse>} Kết quả truy vấn từ VNPay sau khi đã xác thực
     * @en @returns {Promise<QueryDrResponse>} Query result from VNPay after verification
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
     */
    public async queryDr<LoggerFields extends keyof QueryDrResponseLogger>(
        query: QueryDr,
        options?: QueryDrResponseOptions<LoggerFields>,
    ): Promise<QueryDrResponse> {
        return this.queryService.queryDr(query, options);
    }

    /**
     * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
     * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
     *
     * @param {Refund} data - Dữ liệu yêu cầu hoàn tiền
     * @en @param {Refund} data - The data to request refund
     *
     * @param {RefundOptions<LoggerFields>} options - Tùy chọn hoàn tiền
     * @en @param {RefundOptions<LoggerFields>} options - Refund options
     *
     * @returns {Promise<RefundResponse>} Kết quả hoàn tiền từ VNPay sau khi đã xác thực
     * @en @returns {Promise<RefundResponse>} Refund result from VNPay after verification
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
     */
    public async refund<LoggerFields extends keyof RefundResponseLogger>(
        data: Refund,
        options?: RefundOptions<LoggerFields>,
    ): Promise<RefundResponse> {
        return this.queryService.refund(data, options);
    }
}
