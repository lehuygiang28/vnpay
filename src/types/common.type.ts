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
     * Trạng thái giao dịch. Chỉ là `true` khi `isVerified` là `true` và mã phản hồi là thành công.
     *
     * @en Transaction status. `true` only when `isVerified` is `true` and the response code is successful.
     * @example true
     */
    isSuccess: boolean;

    /**
     * Trạng thái xác nhận chữ ký. `false` khi thiếu hoặc sai `vnp_SecureHash`.
     *
     * @en Signature verification status. `false` when `vnp_SecureHash` is missing or invalid.
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
