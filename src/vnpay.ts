import crypto from 'crypto';
import timezone from 'moment-timezone';
import { validate } from 'class-validator';
import {
    CURR_CODE_VND,
    PAYMENT_GATEWAY_SANDBOX,
    VNP_DEFAULT_COMMAND,
    VNP_VERSION,
} from './constants';
import { ConfigVnpayDTO, BuildPaymentUrlDTO } from './dtos';
import { VnpLocale } from './enums';
import { dateFormat } from './utils/common';

/**
 * VNPay class to support VNPay payment
 * @vi_vn Lớp hỗ trợ thanh toán qua VNPay
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = await VNPay.setup({
 *     paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 * });
 *
 * const tnx = '12345678';
 * const urlString = await vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *      vnp_IpAddr: '192.168.0.1',
 *      vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *      vnp_TxnRef: tnx,
 *      vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 */
export class VNPay {
    private globalConfig: ConfigVnpayDTO;

    private constructor(readonly init: ConfigVnpayDTO) {
        this.globalConfig = new ConfigVnpayDTO(init);
    }

    /**
     * Setup the VNPay config
     * @vi_vn Phương thức thiết lập cấu hình cho VNPay
     *
     * @param {ConfigVnpayDTO} init  - The config to setup
     * @returns {VNPay} The VNPay instance
     */
    public static async setup(init: ConfigVnpayDTO): Promise<VNPay> {
        const initValid = new ConfigVnpayDTO(init);
        const err = await validate(initValid);
        if (err.length > 0) {
            throw err;
        }
        return new this(initValid);
    }

    /**
     * Default config for VNPay
     * @vi_vn Cấu hình mặc định cho VNPay
     */
    public get configDefault() {
        return {
            vnp_Version: VNP_VERSION,
            vnp_Command: VNP_DEFAULT_COMMAND,
            vnp_CurrCode: CURR_CODE_VND,
            vnp_Locale: VnpLocale.VN,
            vnp_OrderType: 'other',
        };
    }

    /**
     * Build the payment url
     * @vi_vn Phương thức xây dựng, tạo thành url thanh toán của VNPay
     *
     * @param {BuildPaymentUrlDTO} payload - Payload that contains the information to build the payment url
     * @returns {string} The payment url string
     */
    public buildPaymentUrl(payload: BuildPaymentUrlDTO): Promise<string> {
        return new Promise((resolve, reject) => {
            const data = { ...this.configDefault, ...payload };

            const timeGMT7 = timezone(new Date()).tz('Asia/Ho_Chi_Minh').format();
            data.vnp_CreateDate = dateFormat(new Date(timeGMT7), 'yyyyMMddHHmmss');
            data.vnp_Amount = data.vnp_Amount * 100;
            data.vnp_TmnCode = this.globalConfig.tmnCode;

            const dataValidate = new BuildPaymentUrlDTO(data);
            validate(dataValidate).then((err) => {
                if (err.length > 0) {
                    reject(err);
                }
            });

            const redirectUrl = new URL(
                this.globalConfig.paymentGateway ?? PAYMENT_GATEWAY_SANDBOX,
            );
            Object.entries(data)
                .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
                .forEach(([key, value]) => {
                    // Skip empty value
                    if (!value || value === '' || value === undefined || value === null) {
                        return;
                    }

                    redirectUrl.searchParams.append(key, value.toString());
                });

            const hmac = crypto.createHmac('sha512', this.globalConfig.secureSecret);
            const signed = hmac
                .update(Buffer.from(redirectUrl.search.slice(1).toString()))
                .digest('hex');

            redirectUrl.searchParams.append('vnp_SecureHash', signed);

            return resolve(redirectUrl.toString());
        });
    }
}
