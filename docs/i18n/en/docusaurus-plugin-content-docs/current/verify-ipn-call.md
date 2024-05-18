---
sidebar_position: 5
---

# Xác thực lời gọi IPN

Khi thanh toán hoàn tất, VNPay sẽ gửi lời gọi IPN (Instant Payment Notification) đến URL IPN mà bạn đã cài đặt. Để xác thực lời gọi IPN, bạn có thể sử dụng thư viện VNPay.

## Xác thực IPN

```typescript
import { VerifyIpnCall } from 'vnpay';

const verify: VerifyIpnCall = vnpay.verifyIpnCall(req.query);
```

## Các thuộc tính của đối tượng `VerifyIpnCall`

Thông tin sau khi xác thực và của VNPay trả về

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                           |
| ---------- | ------------ | --------------------------------------------------------------- |
| isSuccess  | boolean      | Kết quả của đơn hàng thanh toán                                 |
| isVerified | boolean      | Kết quả xác thực tính toàn vẹn của dữ liệu khi nhận về từ VNPay |
| message    | string       | Thông báo xác thực                                              |

Xem thêm các thuộc tính VNPay sẽ trả về tại [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1).
:::tip
Các tham số mà VNPay trả về cũng nằm trong đối tượng `VerifyIpnCall`.
:::

## Sử dụng trong Express

### Với MVC

Các bước xác thực URL trả về trong Express với MVC:

1. Tạo một route để xử lý URL trả về
2. Xác thực URL trả về
3. Xử lý thông tin trả về từ VNPay

```typescript title="controllers/payment.controller.ts"
// Route xử lý URL trả về
// Thay vì gửi text bạn có thể render template hoặc chuyển hướng khách hàng đến trang cần thiết
app.get('/vnpay-return', (req, res) => {
    let verify: VerifyReturnUrl;
    try {
        // Sử dụng try-catch để bắt lỗi nếu query không hợp lệ, không đủ dữ liệu
        verify = vnpay.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return res.send('Xác thực tính toàn vẹn dữ liệu không thành công');
        }
        if (!verify.isSuccess) {
            return res.send('Đơn hàng thanh toán không thành công');
        }
    } catch (error) {
        return res.send('Dữ liệu không hợp lệ');
    }

    // Kiểm tra thông tin đơn hàng và xử lý

    return res.send('Xác thực URL trả về thành công');
});
```
