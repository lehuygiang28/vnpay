import { z } from 'zod';
import {
    commonSchema,
    BuildPaymentUrlSchema,
    ConfigVnpaySchema,
    ReturnQueryFromVNPaySchema,
} from './schema';
import { VnpTransactionType } from '../enums';

export const QueryDrSchema = commonSchema
    .pick({
        vnp_TxnRef: true,
    })
    .required()
    .extend({
        /**
         * Mã hệ thống merchant tự sinh ứng với mỗi yêu cầu truy vấn giao dịch.
         * Mã này là duy nhất dùng để phân biệt các yêu cầu truy vấn giao dịch. Không được trùng lặp trong ngày.
         * @en Merchant system code automatically generated for each transaction query request.
         * This code is unique to distinguish transaction query requests. Not duplicated in a day.
         *
         */
        vnp_RequestId: z.string().min(1).max(32),

        /**
         * Thời gian ghi nhận giao dịch tại hệ thống của merchant tính theo GMT+7, định dạng: yyyyMMddHHmmss, tham khảo giá trị:
         * - Thanh toán PAYgiống vnp_CreateDate của vnp_Command=pay
         * - Thanh toán bằng mã Token giống "vnp_create_date" của "vnp_Command=pay_and_create" và "vnp_command=token_pay"
         * - Thanh toán trả góp giống "transaction": {"mcDate": ""} chiều khởi tạo giao dịch trả góp
         * - Thanh toán định kỳ giống "transaction": {"mcDate": ""} chiều khởi tạo yêu cầu thanh toán định kỳ
         *
         * @en Transaction time recorded at merchant system according to GMT + 7, format: yyyyMMddHHmmss, refer to value:
         * - PAY payment same as vnp_CreateDate of vnp_Command = pay
         * - Payment by Token code same as "vnp_create_date" of "vnp_Command = pay_and_create" and "vnp_command = token_pay"
         * - Installment payment same as "transaction": {"mcDate": ""} in the afternoon of initiating the installment payment transaction
         * - Periodic payment same as "transaction": {"mcDate": ""} in the afternoon of initiating the periodic payment request
         */
        vnp_TransactionDate: z.union([
            z.number().min(1).max(Number.MAX_SAFE_INTEGER),
            z.string().length(14),
        ]),

        /**
         * 	Địa chỉ IP của máy chủ thực hiện gọi API
         * @en IP address of the server that calls the API
         */
        vnp_IpAddr: z.string().min(7).max(45),
    })
    .and(
        ConfigVnpaySchema.pick({
            vnp_Version: true,
        }).optional(),
    )
    .and(
        BuildPaymentUrlSchema.pick({
            vnp_OrderInfo: true,
            vnp_CreateDate: true,
        }).required(),
    )
    .and(
        ReturnQueryFromVNPaySchema.pick({
            vnp_TransactionNo: true,
        }).required(),
    );

export const BodyRequestQueryDrSchema = QueryDrSchema.and(
    ReturnQueryFromVNPaySchema.pick({
        vnp_SecureHash: true,
        vnp_TmnCode: true,
    }).required(),
).and(
    BuildPaymentUrlSchema.pick({
        vnp_Command: true,
    }).required(),
);

export const QueryDrResponseFromVNPaySchema = commonSchema
    .pick({
        vnp_TxnRef: true,
        vnp_Amount: true,
        vnp_BankCode: true,
    })
    .extend({
        /**
         * Mã hệ thống VNPAY tự sinh ứng với mỗi yêu cầu truy vấn giao dịch.
         * Mã này là duy nhất dùng để phân biệt các yêu cầu truy vấn giao dịch. Không trùng lặp trong ngày.
         * @en VNPAY system code automatically generated for each transaction query request.
         * This code is unique to distinguish transaction query requests. Not duplicated in a day.
         *
         */
        vnp_ResponseId: z.string().min(1).max(32),

        /**
         * Mô tả thông tin tương ứng với vnp_ResponseCode
         * @en Description of information corresponding to vnp_ResponseCode
         */
        vnp_Message: z.string().min(10).max(255),

        /**
         * Loại giao dịch tại hệ thống VNPAY:
         * - 01: GD thanh toán
         * - 02: Giao dịch hoàn trả toàn phần
         * - 03: Giao dịch hoàn trả một phần
         */
        vnp_TransactionType: z.nativeEnum(VnpTransactionType),

        /**
         * 	Mã khuyến mại. Trong trường hợp khách hàng áp dụng mã QR khuyến mãi khi thanh toán.
         * @en Promotion code. In case customers apply QR promotion code when paying.
         */
        vnp_PromotionCode: z.string().min(1).max(12).optional(),

        /**
         * Số tiền khuyến mại. Trong trường hợp khách hàng áp dụng mã QR khuyến mãi khi thanh toán.
         * @en Promotion amount. In case customers apply QR promotion code when paying.
         */
        vnp_PromotionAmount: z.number().min(1).max(Number.MAX_SAFE_INTEGER).optional(),
    })
    .and(
        BuildPaymentUrlSchema.pick({
            vnp_Command: true,
        }).optional(),
    )
    .and(
        ReturnQueryFromVNPaySchema.pick({
            vnp_TmnCode: true,
            vnp_TransactionNo: true,
            vnp_ResponseCode: true,
            vnp_TransactionStatus: true,
            vnp_SecureHash: true,
        }).optional(),
    )
    .and(
        ReturnQueryFromVNPaySchema.pick({
            vnp_PayDate: true,
        }).optional(),
    )
    .and(
        BuildPaymentUrlSchema.pick({
            vnp_OrderInfo: true,
        }).optional(),
    );

export type QueryDr = z.infer<typeof QueryDrSchema>;
export type BodyRequestQueryDr = z.infer<typeof BodyRequestQueryDrSchema>;
export type QueryDrResponseFromVNPay = z.infer<typeof QueryDrResponseFromVNPaySchema>;
