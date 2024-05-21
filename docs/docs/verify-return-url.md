---
sidebar_position: 6
---

# Xác thực URL thông báo trả về

Khi khách hàng thanh toán thành công, VNPay sẽ chuyển hướng khách hàng đến URL thông báo trả về (`vnp_ReturnUrl`) mà bạn đã cung cấp.

## Xác thực URL trả về

```typescript
import { VerifyReturnUrl } from 'vnpay';

/* ... */

const verify: VerifyReturnUrl = vnpay.verifyReturnUrl(req.query);
```

## Các thuộc tính của đối tượng `VerifyReturnUrl`

Thông tin sau khi xác thực và của VNPay trả về

:::info
Giống với các thuộc tính của đối tượng [`VerifyIpnCall`](./verify-ipn-call.md#các-thuộc-tính-của-đối-tượng-verifyipncall)
:::

## Sử dụng

### Sử dụng logger

-   Tương tự như khi tạo URL thanh toán, bạn có thể sử dụng logger để ghi log thông tin xác thực return URL
    [xem tại đây](./create-payment-url.md#use-logger).

### Với Express MVC

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
