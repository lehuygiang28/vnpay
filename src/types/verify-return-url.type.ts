import type { LoggerData, LoggerOptions } from './logger.type';
import type { ReturnQueryFromVNPay } from './return-from-vnpay.type';

export type VerifyReturnUrl = {
    /**
     * Trạng thái giao dịch
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
     * Thông báo lỗi
     * @en Error message
     * @example 'Giao dịch thành công'
     */
    message: string;
} & ReturnQueryFromVNPay;

export type VerifyReturnUrlLogger = LoggerData<
    {
        createdAt: Date;
    } & VerifyReturnUrl
>;

export type VerifyReturnUrlOptions<Fields extends keyof VerifyReturnUrlLogger> = {
    withHash?: boolean;
} & LoggerOptions<VerifyReturnUrlLogger, Fields>;
