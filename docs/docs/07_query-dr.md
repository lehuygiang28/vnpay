# Truy vấn kết quả giao dịch (queryDr) {#query-dr}

Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch trong hệ thống VNPAY.

:::warning

-   `queryDr` hiện chỉ phù hợp cho các giao dịch thanh toán `PAY`
-   Các loại thanh toán `token`, `installment` và `periodic` chưa tương thích

:::

## QueryDR

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * Ngày phải ở múi giờ GMT+7
 * Và được định dạng theo `yyyyMMddHHmmss`
 * Sử dụng các hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
 */
const date = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const res: QueryDrResponse = await vnpay.queryDr({
    vnp_RequestId: generateRandomString(16),
    vnp_IpAddr: '1.1.1.1',
    vnp_TxnRef: '1716257871703',
    vnp_TransactionNo: 14422574,
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_TransactionDate: date,
    vnp_CreateDate: date,
} as QueryDr);
```

## Thuộc tính

### `QueryDr` {#query-dr-properties}

| Thuộc tính           | Kiểu dữ liệu | Mô tả                                                                              |
| -------------------- | ------------ | ---------------------------------------------------------------------------------- |
| `vnp_RequestId`      | `string`     | ID yêu cầu truy vấn kết quả giao dịch. ID này phải là duy nhất cho mỗi yêu cầu.    |
| `vnp_IpAddr`         | `string`     | Địa chỉ IP của máy khách.                                                          |
| `vnp_TxnRef`         | `string`     | Mã giao dịch của hệ thống merchant.                                                |
| `vnp_TransactionNo`  | `number`     | Mã giao dịch của hệ thống VNPAY.                                                   |
| `vnp_OrderInfo`      | `string`     | Thông tin đơn hàng.                                                                |
| `vnp_TransactionDate`| `number`     | Thời gian giao dịch.                                                               |
| `vnp_CreateDate`     | `number`     | Thời gian tạo giao dịch.                                                           |

### `QueryDrResponse` {#query-dr-response-properties}

| Thuộc tính  | Kiểu dữ liệu | Mô tả                                                                                                                                                                    |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isSuccess   | boolean      | Kết quả của yêu cầu                                                                                                                                                       |
| isVerified  | boolean      | Kết quả xác thực tính toàn vẹn dữ liệu khi nhận từ VNPay                                                                                                                 |
| message     | string       | Thông điệp xác thực                                                                                                                                                       |
| ...         | ...          | Các tham số khác mà VNPay sẽ trả về, tham khảo [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response) |

Xem thêm các thuộc tính mà VNPay sẽ trả về trong [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response).
:::tip
Tất cả các tham số được VNPay trả về đều có trong đối tượng `QueryDrResponse`.
:::

## Cách sử dụng

### Với Logger

-   Để sử dụng logger, bạn cần khởi tạo [`VNPay`](/installation#init-vnpay) với `enableLog` được đặt là `true`.

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * Ngày phải ở múi giờ GMT+7
 * Và được định dạng theo `yyyyMMddHHmmss`
 * Sử dụng các hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
 */
const date = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const res: QueryDrResponse = await vnpay.queryDr(
    {
        vnp_RequestId: generateRandomString(16),
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '1716257871703',
        vnp_TransactionNo: 14422574,
        vnp_OrderInfo: 'Thanh toan don hang',
        vnp_TransactionDate: date,
        vnp_CreateDate: date,
    } as QueryDr,
    {
        logger: {
            type: 'all',
            loggerFn: (data) => {
                console.log(data.message);
                // Hoặc gửi log đến server, cơ sở dữ liệu, v.v.
            },
        },
    },
);
```
