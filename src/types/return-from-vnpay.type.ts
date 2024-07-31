import type { VnpCardType } from '../enums';
import type { BuildPaymentUrl } from './build-payment-url.type';

export type ReturnQueryFromVNPay = Pick<BuildPaymentUrl, 'vnp_OrderInfo' | 'vnp_TxnRef'> & {
    /**
     * Số tiền thanh toán
     * @en Payment amount
     */
    vnp_Amount: number | string;

    /**
     * Mã tmn của đối tác
     * @en Merchant tmn code
     */
    vnp_TmnCode?: string;

    /**
     * Mã Ngân hàng thanh toán
     * @en Bank code
     * @example NCB
     */
    vnp_BankCode?: string;

    /**
     * Mã giao dịch tại Ngân hàng
     * @en Transaction code at bank
     * @example NCB20170829152730
     */
    vnp_BankTranNo?: string;

    /**
     * Loại tài khoản/thẻ khách hàng sử dụng:`ATM`,`QRCODE`
     * @en Type of customer account/card used: `ATM`, `QRCODE`
     * @example ATM
     */
    vnp_CardType?: VnpCardType | string;

    /**
     * Thời gian thanh toán. Định dạng: yyyyMMddHHmmss
     * @en Payment time. Format: yyyyMMddHHmmss
     * @example 20170829152730
     */
    vnp_PayDate?: number | string;

    /**
     * Mã giao dịch ghi nhận tại hệ thống VNPAY.
     * @en Transaction code recorded in VNPAY system.
     * @example 20170829153052
     */
    vnp_TransactionNo?: number | string;

    /**
     * Mã phản hồi kết quả thanh toán. Quy định mã trả lời 00 ứng với kết quả Thành công cho tất cả các API.
     * @en Response code of payment result. The response code 00 corresponds to the Successful result for all APIs.
     * @example 00
     * @see https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
     */
    vnp_ResponseCode: number | string;

    /**
     * Mã phản hồi kết quả thanh toán. Tình trạng của giao dịch tại Cổng thanh toán VNPAY.
     *
     * -00: Giao dịch thanh toán được thực hiện thành công tại VNPAY
     *
     * -Khác 00: Giao dịch không thành công tại VNPAY
     *
     * @en Response code of payment result. Status of transaction at VNPAY payment gateway.
     *
     * -00: Payment transaction is successful at VNPAY
     *
     * -Other 00: Payment transaction is not successful at VNPAY
     *
     * @example 00
     * @see https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
     */
    vnp_TransactionStatus?: number | string;

    /**
     * Mã kiểu bảo mật sử dụng để tạo mã checksum. Mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng.
     * Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.
     *
     * @en Security type code used to create checksum code. This code depends on the configuration of the merchant and the version of the api used.
     * The current version supports `SHA256`, `HMACSHA512`.
     * @example HMACSHA512
     */
    vnp_SecureHashType?: string;

    /**
     * Mã kiểm tra (checksum) để đảm bảo dữ liệu của giao dịch không bị thay đổi trong quá trình chuyển từ merchant sang VNPAY.
     * Việc tạo ra mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng. Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.
     *
     * @en Checksum to ensure that the transaction data is not changed during the transfer from merchant to VNPAY.
     * The creation of this code depends on the configuration of the merchant and the version of the api used. The current version supports `SHA256`, `HMACSHA512`.
     *
     */
    vnp_SecureHash?: string;
};
