# Giao dịch hoàn tiền (refund) {#refund}

Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.

:::warning Lưu ý:

-   `refund` là một trong những chức năng bị VNPAY hạn chế trong môi trường sandbox. Bạn cần liên hệ với VNPAY để được hỗ trợ.
-   Xem thêm tại [issue#12](https://github.com/lehuygiang28/vnpay/issues/12)

:::

## Refund

```typescript
import { Refund, RefundResponse, dateFormat, getDateInGMT7, VnpTransactionType, VnpLocale } from 'vnpay';

/* ... */

/**
 * Ngày phải ở múi giờ GMT+7
 * Và được định dạng theo `yyyyMMddHHmmss`
 * Sử dụng các hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
 */
const refundRequestDate = dateFormat(getDateInGMT7(new Date('2024/05/26')));
const orderCreatedAt = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const result: RefundResponse = await vnpay.refund({
    vnp_Amount: 10000,
    vnp_CreateBy: 'giang',
    vnp_CreateDate: refundRequestDate,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'Test order',
    vnp_RequestId: '123456',
    vnp_TransactionDate: orderCreatedAt,
    vnp_TransactionType: VnpTransactionType.FULL_REFUND,
    vnp_TxnRef: '123456',
    vnp_Locale: VnpLocale.EN,
    // vnp_TransactionNo: 123456, // optional
} as Refund);
```

## Thuộc tính

### `Refund` {#Refund-properties}

| Thuộc tính            | Kiểu dữ liệu         | Mô tả                                                                                                                                          |
| --------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `vnp_Amount`          | `number`             | Số tiền sẽ hoàn trả cho khách hàng. Số tiền này nhỏ hơn hoặc bằng số tiền giao dịch.                                                           |
| `vnp_CreateBy`        | `string`             | Người tạo yêu cầu hoàn tiền. Có thể là tên đăng nhập của merchant thực hiện hoàn tiền.                                                          |
| `vnp_CreateDate`      | `number`             | Thời gian tạo yêu cầu hoàn tiền (Ngày yêu cầu) GMT+7.                                                                                          |
| `vnp_IpAddr`          | `string`             | Địa chỉ IP của máy chủ thực hiện gọi API.                                                                                                       |
| `vnp_OrderInfo`       | `string`             | Mô tả yêu cầu hoàn tiền (Mô tả yêu cầu).                                                                                                        |
| `vnp_RequestId`       | `string`             | Mã do hệ thống merchant tạo ra cho mỗi yêu cầu hoàn tiền. Mã này là duy nhất và dùng để phân biệt các yêu cầu hoàn tiền, không trùng trong ngày. |
| `vnp_TransactionDate` | `number`             | Thời gian giao dịch được ghi nhận trên website merchant, tính theo GMT+7.                                                                        |
| `vnp_TransactionNo`   | `number`             | Mã giao dịch ghi nhận trong hệ thống VNPAY.                                                                                                     |
| `vnp_TransactionType` | `VnpTransactionType` | Loại giao dịch trong hệ thống VNPAY.                                                                                                            |
| `vnp_TxnRef`          | `string`             | Mã giao dịch thanh toán của hệ thống merchant gửi sang VNPAY để yêu cầu thanh toán.                                                             |
| `vnp_Locale`          | `VnpLocale`          | Ngôn ngữ hiển thị trong phản hồi. Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en).                                                               |

### `RefundResponse` {#refund-response-properties}

| Thuộc tính  | Kiểu dữ liệu | Mô tả                                                                                                                                                                 |
| ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess   | boolean      | Kết quả của yêu cầu.                                                                                                                                                  |
| isVerified  | boolean      | Kết quả xác thực tính toàn vẹn dữ liệu khi nhận từ VNPay.                                                                                                             |
| message     | string       | Thông điệp xác thực.                                                                                                                                                  |
| ...         | ...          | Các tham số khác mà VNPay sẽ trả về, tham khảo [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund). |

Xem thêm các thuộc tính mà VNPay sẽ trả về trong [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund).
:::tip
Tất cả các tham số được VNPay trả về đều có trong đối tượng `RefundResponse`.
:::
