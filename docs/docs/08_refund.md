# Giao dịch hoàn tiền (refund) {#refund}

Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.

:::warning Chú ý:

-   `refund` là một trong các chức năng bị hạn chế bởi VNPAY trong môi trường sandbox, bạn cần liên hệ VNPAY để được hỗ trợ.
-   Xem thêm tại [issue#12](https://github.com/lehuygiang28/vnpay/issues/12)

:::

## Refund

```typescript
import { Refund, RefundResponse, dateFormat, getDateInGMT7, VnpTransactionType } from 'vnpay';

/* ... */

/**
 * Date phải là timezone GMT+7
 * Và format theo định dạng `yyyyMMddHHmmss`
 * Dùng 2 hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
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

## Các thuộc tính

### `Refund` {#Refund-properties}

| Thuộc tính            | Kiểu dữ liệu         | Mô tả                                                                                                                                                                      |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vnp_Amount`          | `number`             | Số tiền hoàn trả lại cho khách hàng. Số tiền này nhỏ hơn hoặc bằng số tiền của giao dịch                                                                                   |
| `vnp_CreateBy`        | `string`             | Người khởi tạo hoàn tiền. Có thể là tên user thực hiện hoàn tiền của merchant.                                                                                             |
| `vnp_CreateDate`      | `number`             | Thời gian phát sinh request hoàn (Request Date) GMT+7                                                                                                                      |
| `vnp_IpAddr`          | `string`             | Địa chỉ IP của máy chủ thực hiện gọi API                                                                                                                                   |
| `vnp_OrderInfo`       | `string`             | Mô tả thông tin yêu cầu hoàn( Request description)                                                                                                                         |
| `vnp_RequestId`       | `string`             | Mã hệ thống merchant tự sinh ứng với mỗi yêu cầu hoàn trả giao dịch. Mã này là duy nhất dùng để phân biệt các yêu cầu hoàn trả giao dịch. Không được trùng lặp trong ngày. |
| `vnp_TransactionDate` | `number`             | Thời gian ghi nhận giao dịch tại website của merchant tính theo GMT+7                                                                                                      |
| `vnp_TransactionNo`   | `number`             | Mã giao dịch ghi nhận tại hệ thống VNPAY                                                                                                                                   |
| `vnp_TransactionType` | `VnpTransactionType` | Loại giao dịch tại hệ thống VNPAY                                                                                                                                          |
| `vnp_TxnRef`          | `string`             | Là mã giao dịch thanh toán của hệ thống merchant gửi VNPAY yêu cầu thanh toán.                                                                                             |

### `RefundResponse` {#refund-response-properties}

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                                                                                                                                          |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isSuccess  | boolean      | Kết quả của yêu cầu                                                                                                                                                            |
| isVerified | boolean      | Kết quả xác thực tính toàn vẹn của dữ liệu khi nhận về từ VNPay                                                                                                                |
| message    | string       | Thông báo xác thực                                                                                                                                                             |
| ...        | ...          | Các tham số khác của VNPay sẽ trả về, tham khảo tại [đây](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund) |

Xem thêm các thuộc tính VNPay sẽ trả về tại [VNPay](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund).
:::tip
Các tham số mà [VNPay trả về](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund) cũng nằm trong đối tượng `RefundResponse`.
:::
