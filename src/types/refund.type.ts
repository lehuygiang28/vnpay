import type { RefundTransactionType } from '../enums';
import type { BuildPaymentUrl } from './build-payment-url.type';
import type { ResultVerified } from './common.type';
import type { LoggerData, LoggerOptions } from './logger.type';
import type { QueryDr, QueryDrResponseFromVNPay } from './query-dr.type';

export type Refund = Partial<Pick<QueryDr, 'vnp_TransactionNo'>> &
    Pick<QueryDr, 'vnp_RequestId' | 'vnp_TransactionDate' | 'vnp_IpAddr'> &
    Pick<BuildPaymentUrl, 'vnp_Amount' | 'vnp_OrderInfo' | 'vnp_TxnRef'> &
    Partial<Pick<BuildPaymentUrl, 'vnp_Locale'>> & {
        /**
         * Loại giao dịch tại hệ thống VNPAY:
         * - `02`: Giao dịch hoàn trả toàn phần
         * - `03`: Giao dịch hoàn trả một phần
         *
         * @en:
         * Type of transaction at the VNPAY system:
         * - `02`: Full refund
         * - `03`: Partial refund
         */
        vnp_TransactionType: RefundTransactionType | string;

        /**
         * Người khởi tạo hoàn tiền. Có thể là tên user thực hiện hoàn tiền của merchant.
         *
         * @en
         * The name of user who create the refund transaction of merchant.
         */
        vnp_CreateBy: string;

        /**
         * Thời gian phát sinh yêu cầu hoàn tiền (GMT +7)
         *
         * @en Time of refund request (GMT +7)
         */
        vnp_CreateDate: number;
    };

export type RefundResponseFromVNPay = Pick<
    QueryDrResponseFromVNPay,
    | 'vnp_TxnRef'
    | 'vnp_Amount'
    | 'vnp_ResponseCode'
    | 'vnp_Message'
    | 'vnp_BankCode'
    | 'vnp_PayDate'
    | 'vnp_TransactionNo'
    | 'vnp_TransactionType'
    | 'vnp_TransactionStatus'
    | 'vnp_SecureHash'
> & {
    /**
     * Mã hệ thống VNPAY tự sinh ứng với mỗi yêu cầu hoàn trả giao dịch.
     * Mã này là duy nhất dùng để phân biệt các yêu cầu hoàn trả giao dịch.
     * Không được trùng lặp trong ngày
     *
     * @en VNPAY system code automatically generated for each refund transaction request.
     * The system code is unique for each refund transaction request.
     * Not duplicated in a day.
     */
    vnp_ResponseId: string;

    /**
     * Mã API sử dụng, mã cho giao dịch thanh toán là "refund"
     *
     * @en API code used for payment, the transaction code is "refund"
     */
    vnp_Command: string;

    /**
     * Mã hệ thống VNPAY
     */
    vnp_TmnCode: string;

    /**
     * Nội dung của yêu cầu hoàn tiền
     *
     * @en Content of the refund request
     */
    vnp_OrderInfo: string;
};

export type RefundResponse = ResultVerified & RefundResponseFromVNPay;

export type RefundResponseLogger = LoggerData<
    {
        createdAt: Date;
    } & RefundResponse
>;

export type RefundOptions<Fields extends keyof RefundResponseLogger> = LoggerOptions<
    RefundResponseLogger,
    Fields
>;
