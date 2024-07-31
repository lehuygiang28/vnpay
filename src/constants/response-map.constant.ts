import type { VnpLocale } from '../enums';

export const WRONG_CHECKSUM_KEY = 'WRONG_CHECKSUM_KEY';

export const RESPONSE_MAP = new Map<string, Record<VnpLocale, string>>([
    ['00', { vn: 'Giao dịch thành công', en: 'Approved' }],
    ['01', { vn: 'Giao dịch đã tồn tại', en: 'Transaction is already exist' }],
    [
        '02',
        {
            vn: 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
            en: 'Invalid merchant (check vnp_TmnCode value)',
        },
    ],
    [
        '03',
        {
            vn: 'Dữ liệu gửi sang không đúng định dạng',
            en: 'Sent data is not in the right format',
        },
    ],
    [
        '04',
        {
            vn: 'Khởi tạo GD không thành công do Website đang bị tạm khoá',
            en: 'Payment website is not available',
        },
    ],
    [
        '05',
        {
            vn: 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
            en: 'Transaction failed: Too many wrong password input',
        },
    ],
    [
        '06',
        {
            vn: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
            en: 'Transaction failed: Wrong OTP input',
        },
    ],
    [
        '07',
        {
            vn: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
            en: 'This transaction is suspicious',
        },
    ],
    [
        '08',
        {
            vn: 'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
            en: 'Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.',
        },
    ],
    [
        '09',
        {
            vn: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
            en: 'Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.',
        },
    ],
    [
        '10',
        {
            vn: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            en: 'Transaction failed: Customer incorrectly validate the card / account information more than 3 times',
        },
    ],
    [
        '11',
        {
            vn: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            en: 'Transaction failed: Pending payment is expired. Please try again.',
        },
    ],
    [
        '24',
        {
            vn: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            en: 'Transaction canceled',
        },
    ],
    [
        '51',
        {
            vn: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            en: 'Transaction failed: Your account is not enough balance to make the transaction.',
        },
    ],
    [
        '65',
        {
            vn: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            en: 'Transaction failed: Your account has exceeded the daily limit.',
        },
    ],
    [
        '75',
        {
            vn: 'Ngân hàng thanh toán đang bảo trì',
            en: 'Banking system is under maintenance',
        },
    ],
    [WRONG_CHECKSUM_KEY, { vn: 'Sai checksum', en: 'Wrong checksum' }],
    ['default', { vn: 'Giao dịch thất bại', en: 'Failure' }],
]);

export const QUERY_DR_RESPONSE_MAP = new Map<string, Record<VnpLocale, string>>([
    ['00', { vn: 'Yêu cầu thành công', en: 'Success' }],
    [
        '02',
        {
            vn: 'Mã định danh kết nối không hợp lệ (kiểm tra lại TmnCode)',
            en: 'Invalid connection identifier (check TmnCode)',
        },
    ],
    [
        '03',
        {
            vn: 'Dữ liệu gửi sang không đúng định dạng',
            en: 'Sent data is not in the right format',
        },
    ],
    [
        '91',
        {
            vn: 'Không tìm thấy giao dịch yêu cầu',
            en: 'Transaction not found for request',
        },
    ],
    [
        '94',
        {
            vn: 'Yêu cầu trùng lặp, duplicate request trong thời gian giới hạn của API',
            en: 'Duplicate request within the time limit of the API',
        },
    ],
    [
        '97',
        {
            vn: 'Checksum không hợp lệ',
            en: 'Invalid checksum',
        },
    ],
    [
        '99',
        {
            vn: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
            en: 'Other errors (remaining errors, not in the list of error codes listed)',
        },
    ],
    [WRONG_CHECKSUM_KEY, { vn: 'Sai checksum', en: 'Wrong checksum' }],
    ['default', { vn: 'Giao dịch thất bại', en: 'Failure' }],
]);

export const REFUND_RESPONSE_MAP = new Map<string, Record<VnpLocale, string>>([
    ['00', { vn: 'Yêu cầu thành công', en: 'Success' }],
    [
        '02',
        {
            vn: 'Mã định danh kết nối không hợp lệ (kiểm tra lại TmnCode)',
            en: 'Invalid connection identifier (check TmnCode)',
        },
    ],
    [
        '03',
        {
            vn: 'Dữ liệu gửi sang không đúng định dạng',
            en: 'Sent data is not in the right format',
        },
    ],
    [
        '91',
        {
            vn: 'Không tìm thấy giao dịch yêu cầu hoàn trả',
            en: 'Transaction not found for request refund',
        },
    ],
    [
        '94',
        {
            vn: 'Giao dịch đã được gửi yêu cầu hoàn tiền trước đó. Yêu cầu này VNPAY đang xử lý',
            en: 'The transaction has been sent a refund request before. VNPAY is processing this request',
        },
    ],
    [
        '95',
        {
            vn: 'Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầu',
            en: 'This transaction is not successful from VNPAY. VNPAY refuses to process the request',
        },
    ],
    [
        '97',
        {
            vn: 'Checksum không hợp lệ',
            en: 'Invalid checksum',
        },
    ],
    [
        '99',
        {
            vn: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
            en: 'Other errors (remaining errors, not in the list of error codes listed)',
        },
    ],
    [WRONG_CHECKSUM_KEY, { vn: 'Sai checksum', en: 'Wrong checksum' }],
    ['default', { vn: 'Giao dịch thất bại', en: 'Failure' }],
]);

export const TRANSACTION_STATUS_RESPONSE_MAP = new Map<string, Record<VnpLocale, string>>([
    ['00', { vn: 'Giao dịch thanh toán thành công', en: 'Payment transaction successful' }],
    ['01', { vn: 'Giao dịch chưa hoàn tất', en: 'Transaction not completed' }],
    [
        '02',
        {
            vn: 'Giao dịch bị lỗi',
            en: 'Transaction error',
        },
    ],
    [
        '04',
        {
            vn: 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
            en: 'Transaction reverse (Customer has been deducted money at the Bank but the transaction is not successful at VNPAY)',
        },
    ],
    [
        '05',
        {
            vn: 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
            en: 'VNPAY is processing this transaction (refund)',
        },
    ],
    [
        '06',
        {
            vn: 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
            en: 'VNPAY has sent a refund request to the Bank (refund)',
        },
    ],
    [
        '07',
        {
            vn: 'Giao dịch bị nghi ngờ gian lận',
            en: 'Transaction suspected of fraud',
        },
    ],
    [
        '09',
        {
            vn: 'GD Hoàn trả bị từ chối',
            en: 'Refund transaction is rejected',
        },
    ],
    [WRONG_CHECKSUM_KEY, { vn: 'Sai checksum', en: 'Wrong checksum' }],
]);
