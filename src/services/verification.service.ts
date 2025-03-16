import { WRONG_CHECKSUM_KEY, numberRegex } from '../constants';
import type { HashAlgorithm } from '../enums';
import type {
    GlobalConfig,
    ReturnQueryFromVNPay,
    VerifyIpnCall,
    VerifyIpnCallLogger,
    VerifyIpnCallOptions,
    VerifyReturnUrl,
    VerifyReturnUrlLogger,
    VerifyReturnUrlOptions,
} from '../types';
import { ignoreLogger } from '../utils';
import { getResponseByStatusCode } from '../utils/common';
import { buildPaymentUrlSearchParams, verifySecureHash } from '../utils/payment.util';
import type { LoggerService } from './logger.service';

/**
 * Dịch vụ xác thực dữ liệu từ VNPay
 * @en Verification service for VNPay data
 */
export class VerificationService {
    private readonly config: GlobalConfig;
    private readonly logger: LoggerService;
    private readonly hashAlgorithm: HashAlgorithm;

    /**
     * Khởi tạo dịch vụ xác thực
     * @en Initialize verification service
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
        this.logger = logger;
        this.hashAlgorithm = hashAlgorithm;
    }

    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
     * @en @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
     *
     * @param {VerifyReturnUrlOptions<LoggerFields>} options - Tùy chọn
     * @en @param {VerifyReturnUrlOptions<LoggerFields>} options - Options
     *
     * @returns {VerifyReturnUrl} Kết quả xác thực
     * @en @returns {VerifyReturnUrl} The verification result
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
            secureSecret: this.config.secureSecret,
            data: searchParams.toString(),
            hashAlgorithm: this.hashAlgorithm,
            receivedHash: vnp_SecureHash,
        });

        let outputResults = {
            isVerified,
            isSuccess: cloneQuery.vnp_ResponseCode === '00',
            message: getResponseByStatusCode(
                cloneQuery.vnp_ResponseCode?.toString() ?? '',
                this.config.vnp_Locale,
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

        const data2Log: VerifyReturnUrlLogger = {
            createdAt: new Date(),
            method: 'verifyReturnUrl',
            ...result,
            vnp_SecureHash: options?.withHash ? vnp_SecureHash : undefined,
        };

        this.logger.log(data2Log, options, 'verifyReturnUrl');

        return result;
    }

    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     *
     * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay,
     * kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
     *
     * @en Method to verify the ipn url from VNPay
     *
     * After receiving the call, the merchant system needs to verify the data received from VNPay,
     * check if the order is valid, check if the payment amount is correct.
     *
     * @param {ReturnQueryFromVNPay} query - Đối tượng dữ liệu trả về từ VNPay
     * @en @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
     *
     * @param {VerifyIpnCallOptions<LoggerFields>} options - Tùy chọn
     * @en @param {VerifyIpnCallOptions<LoggerFields>} options - Options
     *
     * @returns {VerifyIpnCall} Kết quả xác thực
     * @en @returns {VerifyIpnCall} The verification result
     */
    public verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(
        query: ReturnQueryFromVNPay,
        options?: VerifyIpnCallOptions<LoggerFields>,
    ): VerifyIpnCall {
        const hash = query.vnp_SecureHash;

        // Use silent logger to avoid double logging
        const silentOptions = { logger: { loggerFn: ignoreLogger } };
        // Fix the 'any' type issue by using a more specific type
        const result = this.verifyReturnUrl(
            query,
            silentOptions as VerifyReturnUrlOptions<keyof VerifyReturnUrlLogger>,
        );

        const data2Log: VerifyIpnCallLogger = {
            createdAt: new Date(),
            method: 'verifyIpnCall',
            ...result,
            ...(options?.withHash ? { vnp_SecureHash: hash } : {}),
        };

        this.logger.log(data2Log, options, 'verifyIpnCall');

        return result;
    }
}
