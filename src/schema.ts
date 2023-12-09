import { z } from 'zod';
import { VnpCurrCode, VnpLocale, VnpOrderType } from './enums';

const commonSchema = z.object({
    /**
     * Số tiền thanh toán. VNPAY phản hồi số tiền nhân thêm 100 lần.
     * @en Amount of payment. VNPAY responds to the amount received plus 100 times.
     */
    vnp_Amount: z.number().min(1).max(Number.MAX_SAFE_INTEGER),
    /**
     * Thông tin mô tả nội dung thanh toán (Tiếng Việt, không dấu).
     * @en Description of payment (Vietnamese, no accent)
     * @example Thanh toan don hang 12345
     */
    vnp_OrderInfo: z.string().min(1).max(255),
    /**
     * Mã tham chiếu của giao dịch tại hệ thống của merchant.
     * Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.
     * Không được trùng lặp trong ngày.
     * @en Reference code of transaction on merchant system. This code is unique to distinguish orders sent to VNPAY. Not duplicated in a day.
     * @example 123456
     */
    vnp_TxnRef: z.string().min(1).max(100),
    /**
     * Mã website của merchant trên hệ thống của VNPAY
     * @en Website code of merchant on VNPAY system
     * @example 2QXUI4J4
     */
    vnp_TmnCode: z.string().min(1).max(8).optional(),
    /**
     * Mã Ngân hàng thanh toán
     * @en Bank code
     * @example NCB
     */
    vnp_BankCode: z.string().min(1).max(20).optional(),
});

export const ConfigVnpaySchema = z.object({
    /**
     * Đường dẫn tới cổng thanh toán của VNPay
     * @en Payment gateway url of VNPay
     */
    paymentGateway: z.string().url().min(1).optional(),
    /**
     * Mã tmn của đối tác
     * @en Merchant tmn code
     */
    tmnCode: z.string().min(1),
    /**
     * Mật khẩu bảo mật của đối tác
     * @en Secure secret of merchant
     */
    secureSecret: z.string().min(1),
    /**
     * Đường dẫn trả về của đối tác
     * @en Return url of merchant
     */
    returnUrl: z.string().url().min(1).optional(),
    /**
     * Phiên bản của API VNPay
     * @en Version of VNPay API
     */
    vnp_Version: z.string().min(1).max(8).optional(),
    /**
     * Đơn vị tiền tệ
     * @en Currency code
     */
    vnp_CurrCode: z.nativeEnum(VnpCurrCode).optional(),
    /**
     * Ngôn ngữ hiển thị trên cổng thanh toán
     * @en Language display on payment gateway
     */
    vnp_Locale: z.nativeEnum(VnpLocale).optional(),
    /**
     * Mã danh mục hàng hóa. Mỗi hàng hóa sẽ thuộc một nhóm danh mục do VNPAY quy định.
     * @en Category code of product. Each product will belong to a category group defined by VNPAY
     * @see https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/
     */
    vnp_OrderType: z.union([z.nativeEnum(VnpOrderType), z.string()]).optional(),
});

export const BuildPaymentUrlSchema = commonSchema.extend({
    /**
     * Phiên bản của API VNPay
     * @en Version of VNPay API
     */
    vnp_Version: z.string().min(1).max(8).optional(),
    /**
     * Mã API sử dụng, mã cho giao dịch thanh toán là: pay
     * @en API code, code for payment transaction is: pay
     */
    vnp_Command: z.string().min(1).max(16).optional(),
    /**
     * Là thời gian phát sinh giao dịch định dạng yyyyMMddHHmmss(Time zone GMT+7)
     * @en Transaction date format yyyyMMddHHmmss(Time zone GMT+7)
     * @example 20170829103111
     */
    vnp_CreateDate: z.number().min(10000000000000).max(Number.MAX_SAFE_INTEGER).optional(),
    /**
     * Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND
     * @en Currency code using for payment. Currently only support VND
     * @example VND
     */
    vnp_CurrCode: z.nativeEnum(VnpCurrCode).optional(),
    /**
     * Địa chỉ IP của khách hàng thực hiện giao dịch
     * @en IP address of customer who make transaction
     * @example 13.160.92.202
     */
    vnp_IpAddr: z.string().min(1).max(45).optional(),
    /**
     * Ngôn ngữ giao diện hiển thị. Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en)
     * @en Language display on payment gateway. Currently support Vietnamese (vn), English (en)
     * @example vn
     */
    vnp_Locale: z.nativeEnum(VnpLocale).optional(),
    /**
     * Loại đơn hàng
     * @en Order type
     * @default 'other'
     * @enum {VnpOrderType} - [VnpOrderType]
     */
    vnp_OrderType: z.union([z.nativeEnum(VnpOrderType), z.string()]).optional(),
    /**
     * URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán.
     * @en URL to notify result of transaction when customer finish payment
     * @example https://domain.vn/VnPayReturn
     */
    vnp_ReturnUrl: z.string().url().max(255).optional(),
    /**
     * Khoá bí mật dùng để tạo mã checksum. Khoá này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng.
     * @en Secret key used to create checksum code. This key depends on the configuration of the merchant and the version of the api used.
     */
    vnp_SecretKey: z.string().optional(),
});

export const ReturnQueryFromVNPaySchema = commonSchema.extend({
    /**
     * Mã giao dịch tại Ngân hàng
     * @en Transaction code at bank
     * @example NCB20170829152730
     */
    vnp_BankTranNo: z.string().min(1).max(255).optional(),
    /**
     * Loại tài khoản/thẻ khách hàng sử dụng:`ATM`,`QRCODE`
     * @en Type of customer account/card used: `ATM`, `QRCODE`
     * @example ATM
     */
    vnp_CardType: z.string().min(2).max(20).optional(),
    /**
     * Thời gian thanh toán. Định dạng: yyyyMMddHHmmss
     * @en Payment time. Format: yyyyMMddHHmmss
     * @example 20170829152730
     */
    vnp_PayDate: z.union([z.number(), z.string()]).optional(),
    /**
     * Mã giao dịch ghi nhận tại hệ thống VNPAY.
     * @en Transaction code recorded in VNPAY system.
     * @example 20170829153052
     */
    vnp_TransactionNo: z.union([z.number(), z.string()]).optional(),
    /**
     * Mã phản hồi kết quả thanh toán. Quy định mã trả lời 00 ứng với kết quả Thành công cho tất cả các API.
     * @en Response code of payment result. The response code 00 corresponds to the Successful result for all APIs.
     * @example 00
     * @see https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/
     */
    vnp_ResponseCode: z.union([z.string(), z.number()]).optional(),
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
    vnp_TransactionStatus: z.union([z.string(), z.number()]).optional(),
    /**
     * Mã kiểu bảo mật sử dụng để tạo mã checksum. Mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng.
     * Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.
     *
     * @en Security type code used to create checksum code. This code depends on the configuration of the merchant and the version of the api used.
     * The current version supports `SHA256`, `HMACSHA512`.
     * @example HMACSHA512
     */
    vnp_SecureHashType: z.string().optional(),
    /**
     * Mã kiểm tra (checksum) để đảm bảo dữ liệu của giao dịch không bị thay đổi trong quá trình chuyển từ merchant sang VNPAY.
     * Việc tạo ra mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng. Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.
     *
     * @en Checksum to ensure that the transaction data is not changed during the transfer from merchant to VNPAY.
     * The creation of this code depends on the configuration of the merchant and the version of the api used. The current version supports `SHA256`, `HMACSHA512`.
     *
     */
    vnp_SecureHash: z.string().min(1).optional(),
});

export const VerifyReturnUrlSchema = ReturnQueryFromVNPaySchema.extend({
    /**
     * Trạng thái giao dịch
     * @en Transaction status
     * @example true
     */
    isSuccess: z.boolean().default(false),
    /**
     * Thông báo lỗi
     * @en Error message
     * @example 'Giao dịch thành công'
     */
    message: z.string().default('').optional(),
});

export type ConfigVnpaySchema = z.infer<typeof ConfigVnpaySchema>;
export type BuildPaymentUrlSchema = z.infer<typeof BuildPaymentUrlSchema>;
export type ReturnQueryFromVNPaySchema = z.infer<typeof ReturnQueryFromVNPaySchema>;
export type VerifyReturnUrlSchema = z.infer<typeof VerifyReturnUrlSchema>;
