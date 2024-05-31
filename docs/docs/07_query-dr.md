# Truy vấn kết quả giao dịch (queryDr) {#query-dr}

Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.

:::warning

-   `queryDr` hiện đang thích hợp với thanh toán `PAY`
-   `token`, `trả góp`, `định kỳ` hiện chưa tương thích

:::

## QueryDR

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * Date phải là timezone GMT+7
 * Và format theo định dạng `yyyyMMddHHmmss`
 * Dùng 2 hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
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

## Các thuộc tính

### `QueryDr` {#query-dr-properties}

| Thuộc tính            | Kiểu dữ liệu | Mô tả                                                                                      |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `vnp_RequestId`       | `string`     | Mã yêu cầu truy vấn kết quả giao dịch. Mã này phải là duy nhất trong mỗi yêu cầu truy vấn. |
| `vnp_IpAddr`          | `string`     | Địa chỉ IP của máy khách hàng.                                                             |
| `vnp_TxnRef`          | `string`     | Mã giao dịch của hệ thống merchant.                                                        |
| `vnp_TransactionNo`   | `number`     | Mã giao dịch của hệ thống VNPAY.                                                           |
| `vnp_OrderInfo`       | `string`     | Thông tin đơn hàng.                                                                        |
| `vnp_TransactionDate` | `number`     | Thời gian giao dịch.                                                                       |
| `vnp_CreateDate`      | `number`     | Thời gian tạo giao dịch.                                                                   |

### `QueryDrResponse` {#query-dr-response-properties}

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                                                                                                                                             |
| ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess  | boolean      | Kết quả của yêu cầu                                                                                                                                                               |
| isVerified | boolean      | Kết quả xác thực tính toàn vẹn của dữ liệu khi nhận về từ VNPay                                                                                                                   |
| message    | string       | Thông báo xác thực                                                                                                                                                                |
| ...        | ...          | Các tham số khác của VNPay sẽ trả về, tham khảo tại [đây](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response) |

Xem thêm các thuộc tính VNPay sẽ trả về tại [VNPay](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response).
:::tip
Các tham số mà [VNPay trả về](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response) cũng nằm trong đối tượng `QueryDrResponse`.
:::

## Sử dụng

### Với logger

-   Để có thể sử dụng logger, bạn cần phải khởi tạo [`VNPay`](/installation#init-vnpay) với `enableLog` là `true`.

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * Date phải là timezone GMT+7
 * Và format theo định dạng `yyyyMMddHHmmss`
 * Dùng 2 hàm `getDateInGMT7` và `dateFormat` để chuyển đổi
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

                // Hoặc gửi log lên server, database, ...
            },
        },
    },
);
```
