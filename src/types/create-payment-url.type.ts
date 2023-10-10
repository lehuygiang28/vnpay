/**
 * - command: Mã API sử dụng, mã cho giao dịch thanh toán là: pay
 * - amount: Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 10,000 VND (mười nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 1000000
 * - ipAddress: Địa chỉ IP của khách hàng thực hiện giao dịch. Ví dụ: 13.160.92.202
 * - orderInfo: Thông tin mô tả nội dung thanh toán (Tiếng Việt, không dấu). Ví dụ: **Nap tien cho thue bao 0123456789. So tien 100,000 VND**
 */
export type TBuildPaymentUrl = {
    command: string;
    amount: number;
    ipAddress: string;
    orderInfo: string;
    orderType?: string;
    bankCode?: string;
    locale?: string;
    tnxRef?: string;
    currCode?: string;
    tmnCode: string;
    version: string;
    returnUrl: string;
    secretKey: string;
    paymentUrl: string;
};
