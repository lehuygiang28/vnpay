import crypto from 'crypto';
import timezone from 'moment-timezone';
import {
    VNPAY_GATEWAY_SANDBOX_HOST,
    GATEWAY_ENDPOINT,
    VNP_DEFAULT_COMMAND,
    VNP_VERSION,
} from './constants';
import { VnpCurrCode, VnpLocale, VnpOrderType } from './enums';
import { dateFormat, getResponseByStatusCode } from './utils/common';
import {
    ConfigVnpaySchema,
    BuildPaymentUrlSchema,
    ReturnQueryFromVNPaySchema,
    VerifyReturnUrlSchema,
} from './schema';

/**
 * Lớp hỗ trợ thanh toán qua VNPay
 * @en VNPay class to support VNPay payment
 * @see https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = new VNPay({
 *     paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 * });
 *
 * const tnx = '12345678'; // Generate your own transaction code
 * const urlString = await vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *      vnp_IpAddr: '192.168.0.1',
 *      vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *      vnp_TxnRef: tnx,
 *      vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 *
 */
export class VNPay {
    private globalConfig: ConfigVnpaySchema;
    private CRYPTO_ALGORITHM = 'sha512';
    private CRYPTO_ENCODING: BufferEncoding = 'utf-8';

    private vnp_Command = VNP_DEFAULT_COMMAND;
    private vnp_OrderType: string | VnpOrderType = VnpOrderType.OTHER;

    public constructor({
        api_Host = VNPAY_GATEWAY_SANDBOX_HOST,
        vnp_Version = VNP_VERSION,
        vnp_CurrCode = VnpCurrCode.VND,
        vnp_Locale = VnpLocale.VN,
        ...init
    }: ConfigVnpaySchema) {
        this.globalConfig = ConfigVnpaySchema.parse({
            api_Host,
            vnp_Version,
            vnp_CurrCode,
            vnp_Locale,
            ...init,
        });
    }

    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     */
    public get defaultConfig() {
        return {
            vnp_Version: this.globalConfig.vnp_Version,
            vnp_CurrCode: this.globalConfig.vnp_CurrCode,
            vnp_Locale: this.globalConfig.vnp_Locale,
            vnp_Command: this.vnp_Command,
            vnp_OrderType: this.vnp_OrderType,
        };
    }

    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrlDTO} payload - Payload that contains the information to build the payment url
     * @returns {string} The payment url string
     */
    public buildPaymentUrl(payload: BuildPaymentUrlSchema): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const validatedPayload = BuildPaymentUrlSchema.parse(payload);

                if (!validatedPayload.vnp_ReturnUrl) {
                    validatedPayload.vnp_ReturnUrl = this.globalConfig.returnUrl;
                }

                const data = { ...this.defaultConfig, ...validatedPayload };
                const timeGMT7 = timezone(new Date()).tz('Asia/Ho_Chi_Minh').format();
                data.vnp_CreateDate = dateFormat(new Date(timeGMT7), 'yyyyMMddHHmmss');
                data.vnp_Amount = data.vnp_Amount * 100;
                data.vnp_TmnCode = this.globalConfig.tmnCode;

                const redirectUrl = new URL(`${this.globalConfig.api_Host}/${GATEWAY_ENDPOINT}`);
                Object.entries(data)
                    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
                    .forEach(([key, value]) => {
                        // Skip empty value
                        if (!value || value === '' || value === undefined || value === null) {
                            return;
                        }

                        redirectUrl.searchParams.append(key, value.toString());
                    });

                const hmac = crypto.createHmac(
                    this.CRYPTO_ALGORITHM,
                    this.globalConfig.secureSecret,
                );
                const signed = hmac
                    .update(
                        Buffer.from(redirectUrl.search.slice(1).toString(), this.CRYPTO_ENCODING),
                    )
                    .digest('hex');

                redirectUrl.searchParams.append('vnp_SecureHash', signed);
                console.log(redirectUrl.search);

                return resolve(redirectUrl.toString());
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPaySchema} query - The object of data return from VNPay
     * @returns {Promise<VerifyReturnUrlSchema>} The return object
     */
    public verifyReturnUrl(query: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema> {
        return new Promise((resolve, reject) => {
            try {
                const vnpayReturnQuery = ReturnQueryFromVNPaySchema.parse(query);
                const secureHash = vnpayReturnQuery.vnp_SecureHash;

                // Will be remove when append to URLSearchParams
                delete vnpayReturnQuery.vnp_SecureHash;
                delete vnpayReturnQuery.vnp_SecureHashType;

                const outputResults = {
                    isSuccess: vnpayReturnQuery.vnp_ResponseCode === '00',
                    message: getResponseByStatusCode(
                        vnpayReturnQuery.vnp_ResponseCode?.toString() ?? '',
                        this.defaultConfig.vnp_Locale,
                    ),
                };

                const searchParams = new URLSearchParams();
                Object.entries(vnpayReturnQuery)
                    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
                    .forEach(([key, value]) => {
                        // Skip empty value
                        if (value === '' || value === undefined || value === null) {
                            return;
                        }

                        searchParams.append(key, value.toString());
                    });

                const hmac = crypto.createHmac(
                    this.CRYPTO_ALGORITHM,
                    this.globalConfig.secureSecret,
                );

                const signed = hmac
                    .update(Buffer.from(searchParams.toString(), this.CRYPTO_ENCODING))
                    .digest('hex');

                if (secureHash === signed) {
                    Object.assign(outputResults, {
                        isSuccess: vnpayReturnQuery.vnp_ResponseCode === '00',
                    });
                } else {
                    Object.assign(outputResults, {
                        isSuccess: false,
                        message: 'Wrong checksum',
                    });
                }

                const returnObject = VerifyReturnUrlSchema.parse({
                    ...vnpayReturnQuery,
                    ...outputResults,
                });

                resolve(returnObject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     * @en Method to verify the ipn url from VNPay
     *
     * @param query The object of data return from VNPay
     * @returns The return object
     */
    public verifyIpnUrl(query: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema> {
        return this.verifyReturnUrl(query);
    }
}
