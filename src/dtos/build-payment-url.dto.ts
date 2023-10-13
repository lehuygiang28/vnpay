import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    IsIP,
    IsEnum,
    IsOptional,
    IsAlphanumeric,
    Length,
    IsUrl,
} from 'class-validator';
import { VnpCurrCode, VnpLocale } from '../enums';

export class BuildPaymentUrlDTO {
    constructor(data: BuildPaymentUrlDTO) {
        this.vnp_Version = data.vnp_Version;
        this.vnp_Command = data.vnp_Command;
        this.vnp_TmnCode = data.vnp_TmnCode;
        this.vnp_Amount = data.vnp_Amount;
        this.vnp_BankCode = data.vnp_BankCode;
        this.vnp_CreateDate = data.vnp_CreateDate;
        this.vnp_CurrCode = data.vnp_CurrCode;
        this.vnp_IpAddr = data.vnp_IpAddr;
        this.vnp_Locale = data.vnp_Locale;
        this.vnp_OrderInfo = data.vnp_OrderInfo;
        this.vnp_OrderType = data.vnp_OrderType;
        this.vnp_ReturnUrl = data.vnp_ReturnUrl;
        this.vnp_TxnRef = data.vnp_TxnRef;
    }

    @IsOptional()
    @IsAlphanumeric()
    @Length(1, 8)
    vnp_Version?: string;

    @IsOptional()
    @IsAlphanumeric()
    @Length(1, 16)
    vnp_Command?: string;

    @IsOptional()
    @IsAlphanumeric()
    @Length(8, 8)
    vnp_TmnCode?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(999999999999)
    vnp_Amount: number;

    @IsOptional()
    @IsAlphanumeric()
    @Length(3, 20)
    vnp_BankCode?: string;

    @IsOptional()
    @IsNumber()
    @Min(10000000000000, { message: 'vnp_CreateDate length must be 14' })
    @Max(99999999999999, { message: 'vnp_CreateDate length must be 14' })
    vnp_CreateDate?: number;

    @IsOptional()
    @IsString()
    @Length(3, 3)
    @IsEnum(VnpCurrCode)
    vnp_CurrCode?: string;

    @IsNotEmpty()
    @IsAlphanumeric()
    @IsIP()
    @Length(7, 45)
    vnp_IpAddr: string;

    @IsOptional()
    @IsEnum(VnpLocale)
    @Length(2, 5)
    vnp_Locale?: string;

    @IsNotEmpty({ message: 'vnp_OrderInfo is required' })
    @IsString({ message: 'vnp_OrderInfo must be string' })
    @Length(1, 255)
    vnp_OrderInfo: string;

    @IsOptional()
    @IsNumber()
    @Length(1, 100)
    vnp_OrderType?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    @Length(10, 255)
    vnp_ReturnUrl?: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @Length(1, 100)
    vnp_TxnRef: string;

    @IsOptional()
    @IsString()
    vnp_SecretKey?: string;
}
