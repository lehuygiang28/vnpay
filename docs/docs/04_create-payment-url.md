# Tạo URL thanh toán

- Tạo đường dẫn thanh toán cho VNPay.
- URL thanh toán là một địa chỉ URL chứa thông tin thanh toán.
- Website TMĐT gửi thông tin này đến Cổng thanh toán VNPAY khi xử lý giao dịch thanh toán trực tuyến cho khách hàng.
- Một URL hợp lệ sẽ có dạng:

```url
https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20240814214148&vnp_CurrCode=VND&vnp_ExpireDate=20240815214148&vnp_IpAddr=1.1.1.1&vnp_Locale=vn&vnp_OrderInfo=order+information+of+123456-1723671708762&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Freturn&vnp_TmnCode=TEST12345&vnp_TxnRef=123456-1723671708762&vnp_Version=2.1.0&vnp_SecureHash=a4dc1ed51f7b9f5e4fe835b9cc85a12aa585d19b4b6f78fdb1cbb2a157deceba39d1517d1976fea8177b2db6b4de983ec6f8e4e439207fc6060491675be11111
```

## Cách tạo URL thanh toán

```typescript
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';

/* ... */

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: '13.160.92.202',
    vnp_TxnRef: '123456',
    vnp_OrderInfo: 'Thanh toan don hang 123456',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
});
```

## API

```ts
buildPaymentUrl(params: BuildPaymentUrl, options?: BuildPaymentUrlOptions): string
```

### Các thuộc tính của `BuildPaymentUrl` {#build-payment-url}

| Thuộc tính    | Mô tả                                          | Ghi chú                                                                                                                                                                                       |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vnp_Amount    | Số tiền thanh toán                             | Đơn vị VND. Số tiền đã được tự động tính toán, không cần nhân 100 lần theo yêu cầu của VNPay                                                                                                 |
| vnp_IpAddr    | Địa chỉ IP của khách hàng thực hiện giao dịch  | Ví dụ: 13.160.92.202                                                                                                                                                                          |
| vnp_TxnRef    | Mã đơn hàng ở phía khách hàng                  | Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày. Ví dụ: 23554                                                                               |
| vnp_OrderInfo | Thông tin đơn hàng                             | Quy định dữ liệu gửi sang VNPAY (Tiếng Việt không dấu và không bao gồm các ký tự đặc biệt). Ví dụ: Nap tien cho thue bao 0123456789. So tien 100,000 VND                                      |
| vnp_OrderType | Loại đơn hàng                                  | Mỗi loại sản phẩm sẽ thuộc một nhóm danh mục được quy định bởi VNPAY. Sử dụng enum có sẵn từ `ProductCode` hoặc xem thêm trong bảng [Danh mục hàng hóa](https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/) |
| vnp_ReturnUrl | Đường dẫn trả về sau khi thanh toán            | Đây là URL mà VNPay sẽ chuyển hướng người dùng sau khi thanh toán hoàn tất. Ví dụ: https://domain.vn/VnPayReturn                                                                              |
| vnp_Locale    | Ngôn ngữ hiển thị trên cổng thanh toán         | Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en)                                                                                                                                               |
| vnp_BankCode  | Mã ngân hàng                                   | Mã ngân hàng được chọn để thanh toán, xem thêm [tại đây](get-bank-list)                                                                                                                      |

Xem thêm các thuộc tính tại [tài liệu chính thức của VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91).

### Các thuộc tính của `BuildPaymentUrlOptions` {#build-payment-url-options}

| Thuộc tính | Kiểu dữ liệu                  | Mô tả                                  | Ghi chú   |
| ---------- | ----------------------------- | -------------------------------------- | --------- |
| withHash   | boolean                       | Cho phép `paymentUrl` có hash          | Tùy chọn  |
| logger     | [LoggerOptions](#logger-options) | Tùy chọn ghi log                   | Tùy chọn  |

#### `LoggerOptions` {#logger-options}

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                          | Ghi chú                       |
| ---------- | ------------ | -------------------------------------------------------------- | ----------------------------- |
| type       | string       | Chế độ chọn trường ghi log, có thể là `pick`, `omit` hoặc `all` | `all` hoặc `pick` hoặc `omit` |
| fields     | string[]     | Chọn trường để bao gồm hoặc loại trừ, tùy thuộc vào `type`     | Tùy chọn                      |
| loggerFn   | Function     | Hàm ghi log nhận một đối tượng và thực thi                     | Tùy chọn                      |

## Sử dụng

### Sử dụng logger {#using-logger}

```typescript
import { ProductCode, VnpLocale, consoleLogger } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl(
    {
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: 'Thanh toan don hang 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:3000/vnpay-return`, // Đường dẫn nên là của frontend
    },
    {
        logger: {
            type: 'all',
            loggerFn: consoleLogger,
        },
    },
);
```

### Sử dụng logger tùy chỉnh

```typescript
import { ProductCode, VnpLocale } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl(
    {
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: 'Thanh toan don hang 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl, // Đường dẫn nên là của frontend
    },
    {
        logger: {
            type: 'pick', // Chế độ chọn trường ghi log, có thể là 'pick', 'omit' hoặc 'all'
            fields: ['createdAt', 'method', 'paymentUrl'], // Chọn các trường để ghi log
            loggerFn: (data) => logToDatabase(data), // Hàm ghi log vào cơ sở dữ liệu, bạn cần tự triển khai
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
    const order = await createOrder(req.body); // Hàm tạo đơn hàng, bạn cần tự triển khai

    // Tạo URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: order.amount,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: order.id,
        vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl, // Đường dẫn nên là của frontend
        vnp_Locale: VnpLocale.VN,
    });

    return res.redirect(paymentUrl);
});
```

### Với Express API

Các bước tạo URL thanh toán trong Express với API:

1. Backend tạo một API để xử lý đơn hàng
2. Frontend gọi API để tạo đơn hàng
3. Sau khi tạo đơn hàng, backend tiến hành tạo URL thanh toán
4. Trả về URL thanh toán cho Frontend
5. Frontend chuyển hướng khách hàng đến URL thanh toán

```typescript title="controllers/api/order.controller.ts"
// API xử lý đơn hàng
app.post('/api/order', async (req, res) => {
    try {
        // Tạo đơn hàng
        const order = await createOrder(req.body); // Hàm tạo đơn hàng, bạn cần tự triển khai

        // Tạo URL thanh toán
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: order.amount,
            vnp_IpAddr:
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.ip,
            vnp_TxnRef: order.id,
            vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: returnUrl, // Đường dẫn nên là của frontend
            vnp_Locale: VnpLocale.VN,
        });

        return res.json({
            success: true,
            paymentUrl,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo đơn hàng',
            error: error.message,
        });
    }
});
```
