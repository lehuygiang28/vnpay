import type { VnpLocale } from '../enums';
import type { GlobalConfig } from './vnpay-config.type';

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
