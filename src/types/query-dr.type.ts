import type { VnpTransactionType } from '../enums';
import type { BuildPaymentUrl } from './build-payment-url.type';
import type { ResultVerified } from './common.type';
import type { LoggerData, LoggerOptions } from './logger.type';
import type { ReturnQueryFromVNPay } from './return-from-vnpay.type';

export type QueryDr = Required<
    Pick<BuildPaymentUrl, 'vnp_TxnRef' | 'vnp_OrderInfo' | 'vnp_CreateDate'> &
        Pick<ReturnQueryFromVNPay, 'vnp_TxnRef'>
> & {
    /**
     * Mã hệ thống merchant tự sinh ứng với mỗi yêu cầu truy vấn giao dịch.
     * Mã này là duy nhất dùng để phân biệt các yêu cầu truy vấn giao dịch. Không được trùng lặp trong ngày.
     * @en Merchant system code automatically generated for each transaction query request.
     * This code is unique to distinguish transaction query requests. Not duplicated in a day.
     *
     */
    vnp_RequestId: string;

    /**
     * Thời gian ghi nhận giao dịch tại hệ thống của merchant tính theo GMT+7, định dạng: yyyyMMddHHmmss, tham khảo giá trị:
     * - Thanh toán PAY giống vnp_CreateDate của vnp_Command=pay
     * - Thanh toán bằng mã Token giống "vnp_create_date" của "vnp_Command=pay_and_create" và "vnp_command=token_pay"
     *
     * @en Transaction time recorded at merchant system according to GMT + 7, format: yyyyMMddHHmmss, refer to value:
     * - PAY payment same as vnp_CreateDate of vnp_Command = pay
     * - Payment by Token code same as "vnp_create_date" of "vnp_Command = pay_and_create" and "vnp_command = token_pay"
     */
    vnp_TransactionDate: number;

    /**
     * 	Địa chỉ IP của máy chủ thực hiện gọi API
     * @en IP address of the server that calls the API
     */
    vnp_IpAddr: string;

    /**
     * Mã giao dịch ghi nhận tại hệ thống VNPAY.
     * @en Transaction code recorded in VNPAY system.
     * @example 20170829153052
     */
    vnp_TransactionNo: number;
};

export type BodyRequestQueryDr = QueryDr & {
    vnp_SecureHash: string;
    vnp_TmnCode: string;
    vnp_Command: string;
    vnp_Version: string;
};

export type QueryDrResponseFromVNPay = Pick<BuildPaymentUrl, 'vnp_TxnRef' | 'vnp_Amount'> & {
    /**
     * Mã phản hồi kết quả xử lý của API.
     * Quy định mã trả lời 00 ứng với yêu cầu được thực hiện thành công.
     * Tham khảo thêm tại bảng mã lỗi.
     *
     * @en
     * Response code of API
     * If the API is executed successfully, the value of the response code is 00.
     * To learn more about the response code, refer to the table below.
     */
    vnp_ResponseCode: string | number;

    /**
     * Loại giao dịch tại hệ thống VNPAY
     */
    vnp_Command: string;

    /**
     * Thời gian thực hiện
     */
    vnp_PayDate: string | number;

    /**
     * Mô tả thông tin yêu cầu
     *
     * @en Description of request
     */
    vnp_OrderInfo: string;

    /**
     * Tình trạng thanh toán của giao dịch tại Cổng thanh toán VNPAY.
     *
     * @en Status of transaction payment at VNPAY payment gateway.
     */
    vnp_TransactionStatus: string | number;

    vnp_SecureHash: string;

    /**
     * Mã Ngân hàng hoặc mã Ví điện tử thanh toán
     * @en Bank code or account number
     * @example NCB
     */
    vnp_BankCode: string;

    /**
     * Mã hệ thống VNPAY tự sinh ứng với mỗi yêu cầu truy vấn giao dịch.
     * Mã này là duy nhất dùng để phân biệt các yêu cầu truy vấn giao dịch. Không trùng lặp trong ngày.
     * @en VNPAY system code automatically generated for each transaction query request.
     * This code is unique to distinguish transaction query requests. Not duplicated in a day.
     */
    vnp_ResponseId: string;

    /**
     * Mô tả thông tin tương ứng với vnp_ResponseCode
     * @en Description of information corresponding to vnp_ResponseCode
     */
    vnp_Message: string;

    /**
     * Loại giao dịch tại hệ thống VNPAY:
     * - 01: GD thanh toán
     * - 02: Giao dịch hoàn trả toàn phần
     * - 03: Giao dịch hoàn trả một phần
     */
    vnp_TransactionType: VnpTransactionType;

    /**
     * 	Mã khuyến mại. Trong trường hợp khách hàng áp dụng mã QR khuyến mãi khi thanh toán.
     * @en Promotion code. In case customers apply QR promotion code when paying.
     */
    vnp_PromotionCode?: string;

    /**
     * Số tiền khuyến mại. Trong trường hợp khách hàng áp dụng mã QR khuyến mãi khi thanh toán.
     * @en Promotion amount. In case customers apply QR promotion code when paying.
     */
    vnp_PromotionAmount?: number;
    vnp_TransactionNo?: number | string;
};

export type QueryDrResponse = QueryDrResponseFromVNPay & ResultVerified;

export type QueryDrResponseLogger = LoggerData<
    {
        createdAt: Date;
    } & QueryDrResponse
>;

export type QueryDrResponseOptions<Fields extends keyof QueryDrResponseLogger> = {
    withHash?: boolean;
} & LoggerOptions<QueryDrResponseLogger, Fields>;
