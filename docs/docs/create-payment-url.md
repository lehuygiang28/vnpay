---
sidebar_position: 3
---

# Tạo URL thanh toán

Tạo đường dẫn thanh toán cho VNPay.

## Tạo URL thanh toán

```typescript
import { ProductCode, VnpLocale } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: '13.160.92.202',
    vnp_TxnRef: '12345',
    vnp_OrderInfo: 'Thanh toan don hang 12345',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
});
```

## API

```ts
buildPaymentUrl(params: BuildPaymentUrl, options?: BuildPaymentUrlOptions): string
```

### Các thuộc tính của `BuildPaymentUrl` {#build-payment-url}

| Thuộc tính    | Mô tả                                          | Ghi chú                                                                                                                                                                                       |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vnp_Amount    | Số tiền thanh toán                             | Đơn vị VND. Số tiền đã được tự động tính toán, không cần nhân 100 lần theo VNPay                                                                                                              |
| vnp_IpAddr    | Địa chỉ IP của khách hàng thực hiện giao dịch. | Ví dụ: 13.160.92.202                                                                                                                                                                          |
| vnp_TxnRef    | Mã đơn hàng ở phía khách hàng                  | Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày. Ví dụ: 23554                                                                               |
| vnp_OrderInfo | Thông tin đơn hàng                             | Quy định dữ liệu gửi sang VNPAY (Tiếng Việt không dấu và không bao gồm các ký tự đặc biệt). Ví dụ: Nap tien cho thue bao 0123456789. So tien 100,000 VND                                      |
| vnp_OrderType | Loại đơn hàng                                  | Mỗi hàng hóa sẽ thuộc một nhóm danh mục do VNPAY quy định. Sử dụng enum có sẵn từ `ProductCode` hoặc xem thêm bảng [Danh mục hàng hóa](https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/) |
| vnp_ReturnUrl | Đường dẫn trả về sau khi thanh toán            | URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán. Ví dụ: https://domain.vn/VnPayReturn                                                                                      |
| vnp_Locale    | Ngôn ngữ hiển thị trên cổng thanh toán         | Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en)                                                                                                                                               |

Xem thêm các thuộc tính khác tại [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91).

### Các thuộc tính của `BuildPaymentUrlOptions` {#build-payment-url-options}

| Thuộc tính | Kiểu dữ liệu                     | Mô tả                         | Ghi chú  |
| ---------- | -------------------------------- | ----------------------------- | -------- |
| withHash   | boolean                          | Cho phép `paymentUrl` có hash | Tùy chọn |
| logger     | [LoggerOptions](#logger-options) | Các option ghi log            | Tùy chọn |

#### `LoggerOptions` {#logger-options}

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                       | Ghi chú                       |
| ---------- | ------------ | ----------------------------------------------------------- | ----------------------------- |
| type       | string       | Chế độ chọn trường log, có thể là `pick`, `omit` hoặc `all` | `all` hoặc `pick` hoặc `omit` |
| fields     | string[]     | Chọn các trường cần hoặc không cần log, tùy theo `type`     | Tùy chọn                      |
| loggerFn   | Function     | Hàm ghi log, nhận vào một object và thực thi                | Tùy chọn                      |

## Sử dụng

### Sử dụng logger {#use-logger}

```typescript
import { ProductCode, VnpLocale, consoleLogger } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl(
    {
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: 'Payment for order 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:${port}/vnpay-return`,
    },
    {
        logger: {
            type: 'pick', // Chế độ chọn trường log, có thể là 'pick', 'omit' hoặc 'all'
            fields: ['createdAt', 'method', 'paymentUrl'], // Chọn các trường cần log
            loggerFn: consoleLogger, // Log dữ liệu ra console, có thể thay bằng hàm khác
        },
    },
);
```

### Sử dụng custom logger

```typescript
import { ProductCode, VnpLocale, consoleLogger } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl(
    {
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: 'Payment for order 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:${port}/vnpay-return`,
    },
    {
        logger: {
            type: 'pick', // Chế độ chọn trường log, có thể là 'pick', 'omit' hoặc 'all'
            fields: ['createdAt', 'method', 'paymentUrl'], // Chọn các trường cần log
            loggerFn: (data) => logToDatabase(data), // Hàm lưu log vào database, bạn cần tự cài đặt
        },
    },
);
```

### Với Express MVC

Các bước tạo URL thanh toán trong Express với MVC:

1. Tạo một route để xử lý đơn hàng
2. Sau khi tạo đơn hàng, tiến hành tạo URL thanh toán
3. Chuyển hướng khách hàng đến URL thanh toán
4. Sau khi thanh toán, VNPay sẽ chuyển hướng khách hàng đến `vnp_ReturnUrl`

```typescript title="controllers/order.controller.ts"
// Route xử lý đơn hàng
app.post('/order', async (req, res) => {
    // Tạo đơn hàng
    const order = await createOrder(req.body); // Hàm tạo đơn hàng, bạn cần tự cài đặt

    // Tạo URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: '12345',
        vnp_OrderInfo: 'Thanh toan don hang 12345',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
        vnp_Locale: VnpLocale.VN,
    });

    return res.redirect(paymentUrl);
});
```

### Với Express API

Các bước tạo URL thanh toán trong Express với API:

1. Backend tạo một API để xử lý đơn hàng
2. Frontend gọi API để tạo đơn hàng
3. Sau khi tạo đơn hàng, tiến hành tạo URL thanh toán
4. Trả về URL thanh toán và/hoặc thông tin đơn hàng cho Frontend
5. Frontend chuyển hướng khách hàng đến URL thanh toán
6. Sau khi thanh toán, VNPay sẽ chuyển hướng khách hàng đến `vnp_ReturnUrl`

```typescript title="server.ts"
// API xử lý đơn hàng
app.post('/api/order', async (req, res) => {
    // Tạo đơn hàng
    const order = await createOrder(req.body); // Hàm tạo đơn hàng, bạn cần tự cài đặt

    // Lấy returnUrl từ frontend gửi lên, nếu không có thì sử dụng mặc định
    const returnUrl = req.body?.returnUrl || 'http://localhost:3000/vnpay-return';

    // Tạo URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: '12345',
        vnp_OrderInfo: 'Thanh toan don hang 12345',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl, // Đường dẫn nên là của frontend
        vnp_Locale: VnpLocale.VN,
    });

    return res.json({ paymentUrl, order });
});
```
