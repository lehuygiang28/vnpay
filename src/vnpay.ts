import {
    GET_BANK_LIST_ENDPOINT,
    PAYMENT_ENDPOINT,
    QUERY_DR_REFUND_ENDPOINT,
    QUERY_DR_RESPONSE_MAP,
    REFUND_RESPONSE_MAP,
    VNPAY_GATEWAY_SANDBOX_HOST,
    VNP_DEFAULT_COMMAND,
    VNP_VERSION,
    WRONG_CHECKSUM_KEY,
    numberRegex,
} from './constants';
import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from './enums';
import type {
    BuildPaymentUrl,
    BuildPaymentUrlLogger,
    BuildPaymentUrlOptions,
    ReturnQueryFromVNPay,
    VNPayConfig,
    VerifyIpnCall,
    VerifyIpnCallLogger,
    VerifyIpnCallOptions,
    VerifyReturnUrl,
    VerifyReturnUrlLogger,
    VerifyReturnUrlOptions,
} from './types';
import type { Bank } from './types/bank.type';
import type { DefaultConfig, GlobalConfig } from './types/common.type';
import type { LoggerOptions } from './types/logger.type';
import type {
    BodyRequestQueryDr,
    QueryDr,
    QueryDrResponse,
    QueryDrResponseFromVNPay,
    QueryDrResponseLogger,
    QueryDrResponseOptions,
} from './types/query-dr.type';
import type {
    Refund,
    RefundOptions,
    RefundResponse,
    RefundResponseFromVNPay,
    RefundResponseLogger,
} from './types/refund.type';
import { consoleLogger, ignoreLogger } from './utils';
import {
    dateFormat,
    getDateInGMT7,
    getResponseByStatusCode,
    hash,
    isValidVnpayDateFormat,
    resolveUrlString,
} from './utils/common';
import {
    buildPaymentUrlSearchParams,
    calculateSecureHash,
    createPaymentUrl,
    verifySecureHash,
} from './utils/payment.util';

/**
 * Lớp hỗ trợ thanh toán qua VNPay
 * @en VNPay class to support VNPay payment
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = new VNPay({
 *     api_Host: 'https://sandbox.vnpayment.vn',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 *     testMode: true, // optional
 *     hashAlgorithm: 'SHA512', // optional
 *     paymentEndpoint: 'paymentv2/vpcpay.html', // optional
 * });
 *
 * const tnx = '12345678'; // Generate your own transaction code
 * const urlString = vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *      vnp_IpAddr: '192.168.0.1',
 *      vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *      vnp_TxnRef: tnx,
 *      vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 *
 */
export class VNPay {
    private globalDefaultConfig: GlobalConfig;
    private HASH_ALGORITHM = HashAlgorithm.SHA512;
    private BUFFER_ENCODE: BufferEncoding = 'utf-8';
    private isEnableLog = false;
    private readonly globalLoggerFn = (data: unknown) => {};

    public constructor({
        vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST,
        vnp_Version = VNP_VERSION,
        vnp_CurrCode = VnpCurrCode.VND,
        vnp_Locale = VnpLocale.VN,
        testMode = false,
        paymentEndpoint = PAYMENT_ENDPOINT,
        ...config
    }: VNPayConfig) {
        if (testMode) {
            vnpayHost = VNPAY_GATEWAY_SANDBOX_HOST;
        }

        if (config?.hashAlgorithm) {
            this.HASH_ALGORITHM = config.hashAlgorithm;
        }

        if (config?.enableLog) {
            this.isEnableLog = config.enableLog;
            // Default logger to console
            this.globalLoggerFn = consoleLogger;
        }

        if (config?.loggerFn) {
            // Custom logger function
            this.globalLoggerFn = config.loggerFn;
        }

        this.globalDefaultConfig = {
            vnpayHost,
            vnp_Version,
            vnp_CurrCode,
            vnp_Locale,
            vnp_OrderType: ProductCode.Other,
            vnp_Command: VNP_DEFAULT_COMMAND,
            paymentEndpoint,
            ...config,
        };
    }

    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     */
    public get defaultConfig(): DefaultConfig {
        return {
            vnp_TmnCode: this.globalDefaultConfig.tmnCode,
            vnp_Version: this.globalDefaultConfig.vnp_Version,
            vnp_CurrCode: this.globalDefaultConfig.vnp_CurrCode,
            vnp_Locale: this.globalDefaultConfig.vnp_Locale,
            vnp_Command: this.globalDefaultConfig.vnp_Command,
            vnp_OrderType: this.globalDefaultConfig.vnp_OrderType,
        };
    }

    /**
     *
     * @returns {Promise<Bank[]>} List of banks
     */
    public async getBankList(): Promise<Bank[]> {
        const response = await fetch(
            resolveUrlString(
                this.globalDefaultConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                GET_BANK_LIST_ENDPOINT,
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tmn_code=${this.globalDefaultConfig.tmnCode}`,
            },
        );
        const bankList = (await response.json()) as Bank[];
        for (const bank of bankList) {
            bank.logo_link = resolveUrlString(
                this.globalDefaultConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                bank.logo_link.slice(1),
            );
        }
        return bankList;
    }

    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Payload that contains the information to build the payment url
     * @returns {string} The payment url string
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
     */
    public buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(
        data: BuildPaymentUrl,
        options?: BuildPaymentUrlOptions<LoggerFields>,
    ): string {
        const dataToBuild = {
            ...this.defaultConfig,
            ...data,

            /**
             * Multiply by 100 to follow VNPay standard, see docs for more detail
             */
            vnp_Amount: data.vnp_Amount * 100,
        };

        if (dataToBuild?.vnp_ExpireDate && !isValidVnpayDateFormat(dataToBuild.vnp_ExpireDate)) {
            // Because the URL still works without vnp_ExpireDate, we keep it optional here.
            // TODO: make it required when VNPAY's `vnp_ExpireDate` is required
            throw new Error(
                'Invalid vnp_ExpireDate format. use `formatDate` utility function to format it',
            );
        }

        if (!isValidVnpayDateFormat(dataToBuild?.vnp_CreateDate ?? 0)) {
            const timeGMT7 = getDateInGMT7();
            dataToBuild.vnp_CreateDate = dateFormat(timeGMT7, 'yyyyMMddHHmmss');
        }

        const redirectUrl = createPaymentUrl({
            config: this.globalDefaultConfig,
            data: dataToBuild,
        });

        const signed = calculateSecureHash({
            secureSecret: this.globalDefaultConfig.secureSecret,
            data: redirectUrl.search.slice(1).toString(),
            hashAlgorithm: this.HASH_ALGORITHM,
            bufferEncode: this.BUFFER_ENCODE,
        });
        redirectUrl.searchParams.append('vnp_SecureHash', signed);

        if (this.isEnableLog) {
            const data2Log: BuildPaymentUrlLogger = {
                createdAt: new Date(),
                method: this.buildPaymentUrl.name,
                paymentUrl: options?.withHash
                    ? redirectUrl.toString()
                    : (() => {
                          const cloneUrl = new URL(redirectUrl.toString());
                          cloneUrl.searchParams.delete('vnp_SecureHash');
                          return cloneUrl.toString();
                      })(),
                ...dataToBuild,
            };
            this.logData(data2Log, options);
        }

        return redirectUrl.toString();
    }

    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
     * @returns {VerifyReturnUrl} The return object
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
     */
    public verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(
        query: ReturnQueryFromVNPay,
        options?: VerifyReturnUrlOptions<LoggerFields>,
    ): VerifyReturnUrl {
        const { vnp_SecureHash = '', vnp_SecureHashType, ...cloneQuery } = query;

        if (typeof cloneQuery?.vnp_Amount !== 'number') {
            const isValidAmount = numberRegex.test(cloneQuery?.vnp_Amount ?? '');
            if (!isValidAmount) {
                throw new Error('Invalid amount');
            }
            cloneQuery.vnp_Amount = Number(cloneQuery.vnp_Amount);
        }

        const searchParams = buildPaymentUrlSearchParams(cloneQuery);
        const isVerified = verifySecureHash({
            secureSecret: this.globalDefaultConfig.secureSecret,
            data: searchParams.toString(),
            hashAlgorithm: this.HASH_ALGORITHM,
            receivedHash: vnp_SecureHash,
        });

        let outputResults = {
            isVerified,
            isSuccess: cloneQuery.vnp_ResponseCode === '00',
            message: getResponseByStatusCode(
                cloneQuery.vnp_ResponseCode?.toString() ?? '',
                this.globalDefaultConfig.vnp_Locale,
            ),
        };

        if (!isVerified) {
            outputResults = {
                ...outputResults,
                message: 'Wrong checksum',
            };
        }

        const result = {
            ...cloneQuery,
            ...outputResults,
            vnp_Amount: cloneQuery.vnp_Amount / 100,
        };

        if (this.isEnableLog) {
            const data2Log: VerifyReturnUrlLogger = {
                createdAt: new Date(),
                method: this.verifyReturnUrl.name,
                ...result,
                vnp_SecureHash: options?.withHash ? vnp_SecureHash : undefined,
            };

            this.logData(data2Log, options);
        }

        return result;
    }

    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     *
     * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay, kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
     *
     * Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`
     *
     * @en Method to verify the ipn url from VNPay
     *
     * After receiving the call, the merchant system needs to verify the data received from VNPay, check if the order is valid, check if the payment amount is correct.
     *
     * Then respond to VNPay the verification result through the `IpnResponse`
     *
     * @param {ReturnQueryFromVNPay} query The object of data return from VNPay
     * @returns {VerifyIpnCall} The return object
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url
     */
    public verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(
        query: ReturnQueryFromVNPay,
        options?: VerifyIpnCallOptions<LoggerFields>,
    ): VerifyIpnCall {
        const hash = query.vnp_SecureHash;
        const result = this.verifyReturnUrl(query, { logger: { loggerFn: ignoreLogger } });

        if (this.isEnableLog) {
            let data2Log: VerifyIpnCallLogger = {
                createdAt: new Date(),
                method: this.verifyIpnCall.name,
                ...result,
            };

            if (options?.withHash) {
                data2Log = {
                    ...data2Log,
                    vnp_SecureHash: hash,
                };
            }

            this.logData(data2Log, options);
        }

        return result;
    }

    /**
     * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
     *
     * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
     *
     * @param {QueryDr} query - The data to query payment result
     * @returns {Promise<QueryDrResponse>} The data return from VNPay and after verified
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
     */
    public async queryDr<LoggerFields extends keyof QueryDrResponseLogger>(
        query: QueryDr,
        options?: QueryDrResponseOptions<LoggerFields>,
    ): Promise<QueryDrResponse> {
        const command = 'querydr';
        const dataQuery = {
            vnp_Version: this.globalDefaultConfig.vnp_Version ?? VNP_VERSION,
            ...query,
        };

        const url = new URL(
            resolveUrlString(
                this.globalDefaultConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                QUERY_DR_REFUND_ENDPOINT,
            ),
        );

        const stringToCreateHash = [
            dataQuery.vnp_RequestId,
            dataQuery.vnp_Version,
            command,
            this.globalDefaultConfig.tmnCode,
            dataQuery.vnp_TxnRef,
            dataQuery.vnp_TransactionDate,
            dataQuery.vnp_CreateDate,
            dataQuery.vnp_IpAddr,
            dataQuery.vnp_OrderInfo,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');

        const requestHashed = hash(
            this.globalDefaultConfig.secureSecret,
            Buffer.from(stringToCreateHash, this.BUFFER_ENCODE),
            this.HASH_ALGORITHM,
        );

        const body: BodyRequestQueryDr = {
            ...dataQuery,
            vnp_Command: command,
            vnp_TmnCode: this.globalDefaultConfig.tmnCode,
            vnp_SecureHash: requestHashed,
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = (await response.json()) as QueryDrResponseFromVNPay;

        const message = getResponseByStatusCode(
            responseData.vnp_ResponseCode?.toString() ?? '',
            this.globalDefaultConfig.vnp_Locale,
            QUERY_DR_RESPONSE_MAP,
        );
        let outputResults = {
            isVerified: true,
            isSuccess:
                responseData.vnp_ResponseCode === '00' || responseData.vnp_ResponseCode === 0,
            message,
            ...responseData,
            vnp_Message: message,
        };

        const stringToCreateHashOfResponse = [
            responseData.vnp_ResponseId,
            responseData.vnp_Command,
            responseData.vnp_ResponseCode,
            responseData.vnp_Message,
            this.defaultConfig.vnp_TmnCode,
            responseData.vnp_TxnRef,
            responseData.vnp_Amount,
            responseData.vnp_BankCode,
            responseData.vnp_PayDate,
            responseData.vnp_TransactionNo,
            responseData.vnp_TransactionType,
            responseData.vnp_TransactionStatus,
            responseData.vnp_OrderInfo,
            responseData.vnp_PromotionCode,
            responseData.vnp_PromotionAmount,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');

        const responseHashed = hash(
            this.globalDefaultConfig.secureSecret,
            Buffer.from(stringToCreateHashOfResponse, this.BUFFER_ENCODE),
            this.HASH_ALGORITHM,
        );

        if (responseData?.vnp_SecureHash && responseHashed !== responseData.vnp_SecureHash) {
            outputResults = {
                ...outputResults,
                isVerified: false,
                message: getResponseByStatusCode(
                    WRONG_CHECKSUM_KEY,
                    this.globalDefaultConfig.vnp_Locale,
                    QUERY_DR_RESPONSE_MAP,
                ),
            };
        }

        if (this.isEnableLog) {
            const data2Log: QueryDrResponseLogger = {
                createdAt: new Date(),
                method: this.queryDr.name,
                ...outputResults,
            };

            this.logData(data2Log, options);
        }

        return outputResults;
    }

    /**
     * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
     *
     * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
     * @param {Refund} data - The data to request refund
     * @returns The data return from VNPay
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
     */
    public async refund<LoggerFields extends keyof RefundResponseLogger>(
        data: Refund,
        options?: RefundOptions<LoggerFields>,
    ): Promise<RefundResponse> {
        const vnp_Command = 'refund';
        const DEFAULT_TRANSACTION_NO_IF_NOT_EXIST = '0';
        const dataQuery = {
            ...data,
            vnp_Command,
            vnp_Version: this.globalDefaultConfig.vnp_Version,
            vnp_TmnCode: this.globalDefaultConfig.tmnCode,
            vnp_Amount: data.vnp_Amount * 100,
        };
        const {
            vnp_Version,
            vnp_TmnCode,
            vnp_RequestId,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_TransactionNo = '0',
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        } = dataQuery;

        const url = new URL(
            resolveUrlString(
                this.globalDefaultConfig.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
                QUERY_DR_REFUND_ENDPOINT,
            ),
        );

        const stringToHashOfRequest = [
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode,
            vnp_TransactionType,
            vnp_TxnRef,
            dataQuery.vnp_Amount,
            vnp_TransactionNo,
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');

        const requestHashed = hash(
            this.globalDefaultConfig.secureSecret,
            Buffer.from(stringToHashOfRequest, this.BUFFER_ENCODE),
            this.HASH_ALGORITHM,
        );

        const body = {
            ...dataQuery,
            vnp_SecureHash: requestHashed,
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = (await response.json()) as RefundResponseFromVNPay;

        if (responseData?.vnp_Amount) {
            responseData.vnp_Amount = responseData.vnp_Amount / 100;
        }

        const message = getResponseByStatusCode(
            responseData.vnp_ResponseCode?.toString() ?? '',
            data?.vnp_Locale ?? this.globalDefaultConfig.vnp_Locale,
            REFUND_RESPONSE_MAP,
        );
        let outputResults = {
            isVerified: true,
            isSuccess:
                responseData.vnp_ResponseCode === '00' || responseData.vnp_ResponseCode === 0,
            message,
            ...responseData,
            vnp_Message: message,
        };

        // Only check signed hash when request is not error
        if (
            Number(responseData.vnp_ResponseCode) <= 90 &&
            Number(responseData.vnp_ResponseCode) >= 99
        ) {
            const stringToCreateHashOfResponse = [
                responseData.vnp_ResponseId,
                responseData.vnp_Command,
                responseData.vnp_ResponseCode,
                responseData.vnp_Message,
                responseData.vnp_TmnCode,
                responseData.vnp_TxnRef,
                responseData.vnp_Amount,
                responseData.vnp_BankCode,
                responseData.vnp_PayDate,
                responseData.vnp_TransactionNo ?? DEFAULT_TRANSACTION_NO_IF_NOT_EXIST,
                responseData.vnp_TransactionType,
                responseData.vnp_TransactionStatus,
                responseData.vnp_OrderInfo,
            ]
                .map(String)
                .join('|')
                .replace(/undefined/g, '');

            const responseHashed = hash(
                this.globalDefaultConfig.secureSecret,
                Buffer.from(stringToCreateHashOfResponse, this.BUFFER_ENCODE),
                this.HASH_ALGORITHM,
            );

            if (responseData?.vnp_SecureHash && responseHashed !== responseData.vnp_SecureHash) {
                outputResults = {
                    ...outputResults,
                    isVerified: false,
                    message: getResponseByStatusCode(
                        WRONG_CHECKSUM_KEY,
                        this.globalDefaultConfig.vnp_Locale,
                        REFUND_RESPONSE_MAP,
                    ),
                };
            }
        }

        if (this.isEnableLog) {
            const data2Log: RefundResponseLogger = {
                createdAt: new Date(),
                method: this.refund.name,
                ...outputResults,
            };

            this.logData(data2Log, options);
        }

        return outputResults;
    }

    private logData<T extends object, LoggerFields extends keyof T>(
        data: T,
        options?: LoggerOptions<T, LoggerFields>,
    ): void {
        if (options?.logger && 'fields' in options.logger) {
            const { type, fields } = options.logger;

            for (const key of Object.keys(data)) {
                const keyAssert = key as unknown as LoggerFields;
                if (
                    (type === 'omit' && fields.includes(keyAssert)) ||
                    (type === 'pick' && !fields.includes(keyAssert))
                ) {
                    delete data[keyAssert];
                }
            }
        }

        // Exec logger function, or default global logger
        (options?.logger?.loggerFn || this.globalLoggerFn)(data);
    }
}
