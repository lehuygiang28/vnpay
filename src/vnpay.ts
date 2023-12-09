import crypto from 'crypto';
import timezone from 'moment-timezone';
import { PAYMENT_GATEWAY_SANDBOX, VNP_DEFAULT_COMMAND, VNP_VERSION } from './constants';
import { VnpCurrCode, VnpLocale, VnpOrderType } from './enums';
import { dateFormat } from './utils/common';
import {
    ConfigVnpaySchema,
    BuildPaymentUrlSchema,
    ReturnQueryFromVNPaySchema,
    VerifyReturnUrlSchema,
} from './schema';

/**
 * VNPay class to support VNPay payment
 * @vi_vn Lớp hỗ trợ thanh toán qua VNPay
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
 */
export class VNPay {
    private globalConfig: ConfigVnpaySchema;
    private CRYPTO_ALGORITHM = 'sha512';
    private CRYPTO_ENCODING: BufferEncoding = 'utf-8';

    private vnp_Command = VNP_DEFAULT_COMMAND;
    private vnp_OrderType: string | VnpOrderType = VnpOrderType.OTHER;

    public constructor({
        paymentGateway = PAYMENT_GATEWAY_SANDBOX,
        vnp_Version = VNP_VERSION,
        vnp_CurrCode = VnpCurrCode.VND,
        vnp_Locale = VnpLocale.VN,
        ...init
    }: ConfigVnpaySchema) {
        this.globalConfig = ConfigVnpaySchema.parse({
            paymentGateway,
            vnp_Version,
            vnp_CurrCode,
            vnp_Locale,
            ...init,
        });
    }

    /**
     * Default config for VNPay
     * @vi_vn Cấu hình mặc định cho VNPay
     */
    public get configDefault() {
        return {
            vnp_Version: this.globalConfig.vnp_Version,
            vnp_CurrCode: this.globalConfig.vnp_CurrCode,
            vnp_Locale: this.globalConfig.vnp_Locale,
            vnp_Command: this.vnp_Command,
            vnp_OrderType: this.vnp_OrderType,
        };
    }

    /**
     * Build the payment url
     * @vi_vn Phương thức xây dựng, tạo thành url thanh toán của VNPay
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

                const data = { ...this.configDefault, ...validatedPayload };
                const timeGMT7 = timezone(new Date()).tz('Asia/Ho_Chi_Minh').format();
                data.vnp_CreateDate = dateFormat(new Date(timeGMT7), 'yyyyMMddHHmmss');
                data.vnp_Amount = data.vnp_Amount * 100;
                data.vnp_TmnCode = this.globalConfig.tmnCode;

                const redirectUrl = new URL(String(this.globalConfig.paymentGateway));
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

                return resolve(redirectUrl.toString());
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Method to verify the return url from VNPay
     * @vi_vn Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
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
                    message: VNPay.getResponseByStatusCode(
                        vnpayReturnQuery.vnp_ResponseCode?.toString() ?? '',
                        this.configDefault.vnp_Locale,
                    ),
                };

                const urlReturn = new URL(
                    this.globalConfig.paymentGateway ?? PAYMENT_GATEWAY_SANDBOX,
                );
                Object.entries(vnpayReturnQuery)
                    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
                    .forEach(([key, value]) => {
                        // Skip empty value
                        if (value === '' || value === undefined || value === null) {
                            return;
                        }

                        urlReturn.searchParams.append(key, value.toString());
                    });

                const hmac = crypto.createHmac(
                    this.CRYPTO_ALGORITHM,
                    this.globalConfig.secureSecret,
                );

                const signed = hmac
                    .update(Buffer.from(urlReturn.search.slice(1).toString(), this.CRYPTO_ENCODING))
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

    public verifyIpnUrl(query: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema> {
        return this.verifyReturnUrl(query);
    }

    /**
     *
     * @param responseCode The response code from VNPay
     * @param locale The locale to get the response text
     * @returns The response text
     */
    static getResponseByStatusCode(responseCode: string, locale = VnpLocale.VN): string {
        const responseMap = new Map<string, Record<VnpLocale, string>>([
            ['00', { vn: 'Giao dịch thành công', en: 'Approved' }],
            ['01', { vn: 'Giao dịch đã tồn tại', en: 'Transaction is already exist' }],
            [
                '02',
                {
                    vn: 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
                    en: 'Invalid merchant (check vnp_TmnCode value)',
                },
            ],
            [
                '03',
                {
                    vn: 'Dữ liệu gửi sang không đúng định dạng',
                    en: 'Sent data is not in the right format',
                },
            ],
            [
                '04',
                {
                    vn: 'Khởi tạo GD không thành công do Website đang bị tạm khoá',
                    en: 'Payment website is not available',
                },
            ],
            [
                '05',
                {
                    vn: 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
                    en: 'Transaction failed: Too many wrong password input',
                },
            ],
            [
                '06',
                {
                    vn: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
                    en: 'Transaction failed: Wrong OTP input',
                },
            ],
            [
                '07',
                {
                    vn: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
                    en: 'This transaction is suspicious',
                },
            ],
            [
                '08',
                {
                    vn: 'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
                    en: 'Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.',
                },
            ],
            [
                '09',
                {
                    vn: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
                    en: 'Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.',
                },
            ],
            [
                '10',
                {
                    vn: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
                    en: 'Transaction failed: Customer incorrectly validate the card / account information more than 3 times',
                },
            ],
            [
                '11',
                {
                    vn: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
                    en: 'Transaction failed: Pending payment is expired. Please try again.',
                },
            ],
            [
                '24',
                {
                    vn: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
                    en: 'Transaction canceled',
                },
            ],
            [
                '51',
                {
                    vn: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
                    en: 'Transaction failed: Your account is not enough balance to make the transaction.',
                },
            ],
            [
                '65',
                {
                    vn: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
                    en: 'Transaction failed: Your account has exceeded the daily limit.',
                },
            ],
            [
                '75',
                {
                    vn: 'Ngân hàng thanh toán đang bảo trì',
                    en: 'Banking system is under maintenance',
                },
            ],
            ['default', { vn: 'Giao dịch thất bại', en: 'Failure' }],
        ]);

        const respondText: Record<VnpLocale, string> =
            responseMap.get(responseCode) ??
            (responseMap.get('default') as Record<VnpLocale, string>);

        return respondText[locale];
    }
}
