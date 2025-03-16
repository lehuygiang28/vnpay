import type { DefaultConfig } from './common.type';
import type { LoggerData, LoggerOptions } from './logger.type';
import type { GlobalConfig } from './vnpay-config.type';

export type BuildPaymentUrl = {
    /**
     * Số tiền thanh toán. Đã tự động tính toán theo đơn vị của VNPay. (100 lần số tiền của đơn hàng trong cơ sở dữ liệu của bạn)
     * @en Amount of payment. Automatically calculated according to the unit of VNPay. (100 times the amount of the order in your database)
     */
    vnp_Amount: number;

    /**
     * Thông tin mô tả nội dung thanh toán (Tiếng Việt, không dấu).
     * @en Description of payment (Vietnamese, no accent)
     * @example Thanh toan don hang 12345
     */
    vnp_OrderInfo: string;

    /**
     * Mã tham chiếu của giao dịch tại hệ thống của merchant.
     * Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.
     * Không được trùng lặp trong ngày.
     * @en Reference code of transaction on merchant system. This code is unique to distinguish orders sent to VNPAY. Not duplicated in a day.
     * @example 123456
     */
    vnp_TxnRef: string;

    /**
     * Địa chỉ IP của khách hàng thực hiện giao dịch
     * @en IP address of customer who make transaction
     * @example 13.160.92.202
     */
    vnp_IpAddr: string;

    /**
     * URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán.
     * @en URL to notify result of transaction when customer finish payment
     * @example https://domain.vn/VnPayReturn
     */
    vnp_ReturnUrl: string;

    /**
     * Là thời gian phát sinh giao dịch, định dạng yyyyMMddHHmmss(Time zone GMT+7)
     *
     * Nếu `vnp_CreateDate` truyền vào không đúng định dạng, sẽ tự động lấy thời gian hiện tại
     *
     * @en Transaction date format yyyyMMddHHmmss(Time zone GMT+7)
     *
     * If `vnp_CreateDate` is not in the correct format, it will be the current time
     * @example 20170829103111
     * @example
     * ```ts
     *  import { dateFormat } from 'vnpay';
     *
     *  // then
     *  vnp_CreateDate: dateFormat(new Date()),
     * ```
     */
    vnp_CreateDate?: number;

    /**
     * Thời gian hết hạn thanh toán, định dạng yyyyMMddHHmmss(Time zone GMT+7)
     *
     * @en Time of expiration of payment, format yyyyMMddHHmmss(Time zone GMT+7)
     * @example 20170829103111
     * @example
     * ```ts
     *  import { dateFormat } from 'vnpay';
     *
     *  const tomorrow = new Date();
     *  tomorrow.setDate(tomorrow.getDate() + 1);
     *
     *  // then
     *  vnp_CreateDate: dateFormat(tomorrow),
     * ```
     */
    vnp_ExpireDate?: number;

    /**
     * Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
     * @en Currency code using for payment. Currently only support VND
     * @example VND
     */
    vnp_CurrCode?: GlobalConfig['vnp_CurrCode'];

    /**
     * Ngôn ngữ giao diện hiển thị. Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en)
     * @en Language display on payment gateway. Currently support Vietnamese (vn), English (en)
     * @example vn
     */
    vnp_Locale?: GlobalConfig['vnp_Locale'];

    /**
     * Loại đơn hàng/ Mã sản phẩm
     * @en Order type/ Product Code
     * @default 'other'
     * @enum {ProductCode} - [ProductCode]
     */
    vnp_OrderType?: GlobalConfig['vnp_OrderType'];

    /**
     * Mã Ngân hàng thanh toán
     * @en Bank code
     * @example NCB
     */
    vnp_BankCode?: string;
};

export type BuildPaymentUrlLogger = LoggerData<
    {
        createdAt: Date;
        paymentUrl: string;
    } & DefaultConfig &
        BuildPaymentUrl
>;

export type BuildPaymentUrlOptions<Fields extends keyof BuildPaymentUrlLogger> = {
    withHash?: boolean;
} & LoggerOptions<BuildPaymentUrlLogger, Fields>;
