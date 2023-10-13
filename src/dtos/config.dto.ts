import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { PAYMENT_GATEWAY_SANDBOX } from '../constants';

/**
 * The global config for vnpay
 * @see https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
 */
export class ConfigVnpayDTO {
    constructor({ paymentGateway = PAYMENT_GATEWAY_SANDBOX, ...config }: ConfigVnpayDTO) {
        this.paymentGateway = paymentGateway;
        this.tmnCode = config.tmnCode;
        this.secureSecret = config.secureSecret;
        this.returnUrl = config.returnUrl;
    }

    /**
     * The payment gateway url, default is PAYMENT_GATEWAY_SANDBOX
     * @default PAYMENT_GATEWAY_SANDBOX
     */
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    paymentGateway?: string;

    /**
     * The merchant code
     * @example 2QXUI4B4
     */
    @IsNotEmpty()
    @IsString()
    tmnCode: string;

    /**
     * The secure secret
     * @example 2QXUI4B42QXUI4B42QXUI4B4
     */
    @IsNotEmpty()
    @IsString()
    secureSecret: string;

    /**
     * The return url that vnpay will redirect to after payment
     * @example https://sandbox.vnpayment.vn/tryitnow/Home/ReturnResult
     */
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    returnUrl: string;
}
