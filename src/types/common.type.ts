import { ProductCode, VnpCurrCode, VnpLocale } from '../enums';
import { VNPayConfig } from './vnpay-config.type';

export type GlobalConfig = Omit<VNPayConfig, 'testMode' | 'enableLog' | 'loggerFn'> & {
    vnpayHost: string;
    vnp_Locale: VnpLocale;
    vnp_CurrCode: VnpCurrCode;
    vnp_Command: string;
    vnp_OrderType: ProductCode | string;
    vnp_Version: string;
};

export type DefaultConfig = Pick<
    GlobalConfig,
    'vnp_Version' | 'vnp_CurrCode' | 'vnp_Command' | 'vnp_OrderType'
> & {
    vnp_TmnCode: string;
    vnp_Locale: VnpLocale;
};

export type ResultVerified = {
    /**
     * Trạng thái giao dịch
     *
     * @en Transaction status
     * @example true
     */
    isSuccess: boolean;

    /**
     * Trạng thái xác nhận tính đúng đắn, toàn vẹn khi nhận dữ liệu từ VNPay
     *
     * @en Verification status, true when data from VNPay is correct and verified
     * @example true
     */
    isVerified: boolean;

    /**
     * Tin nhắn thông báo
     *
     * @en Error message
     * @example 'Giao dịch thành công'
     */
    message: string;
};
