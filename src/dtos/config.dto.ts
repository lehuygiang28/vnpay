import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { PAYMENT_GATEWAY_SANDBOX } from '../constants';

export class ConfigVnpayDTO {
    constructor(config: ConfigVnpayDTO) {
        this.paymentGateway = config?.paymentGateway ?? PAYMENT_GATEWAY_SANDBOX;
        this.tmnCode = config.tmnCode;
        this.secureSecret = config.secureSecret;
    }

    @IsString()
    @IsUrl()
    paymentGateway: string;

    @IsString()
    @IsNotEmpty()
    tmnCode: string;

    @IsString()
    @IsNotEmpty()
    secureSecret: string;
}
