# Xác thực URL thông báo trả về

Khi khách hàng thanh toán thành công, VNPay sẽ chuyển hướng khách hàng đến URL thông báo trả về (`vnp_ReturnUrl`) mà bạn đã cung cấp.

## Xác thực URL trả về

```typescript
import { VerifyReturnUrl } from 'vnpay';

/* ... */

const verify: VerifyReturnUrl = vnpay.verifyReturnUrl(req.query);
```

## Thuộc tính của đối tượng `VerifyReturnUrl`

Thông tin sau khi xác thực và được trả về từ VNPay:

:::info
Tương tự như các thuộc tính của đối tượng [`VerifyIpnCall`](/ipn/verify-ipn-call#properties-of-the-verify-ipn-call)
:::

## Cách sử dụng

### Sử dụng Logger

- Tương tự như khi tạo URL thanh toán, bạn có thể sử dụng logger để ghi log thông tin xác thực URL trả về
  [xem tại đây](/create-payment-url#using-logger).

### Với Express MVC

Các bước xác thực URL trả về trong Express với MVC:

1. Tạo một route để xử lý URL trả về
2. Xác thực URL trả về
3. Xử lý thông tin trả về từ VNPay

```typescript title="controllers/payment.controller.ts"
// Route xử lý URL trả về
// Thay vì hiển thị văn bản, bạn có thể render một template hoặc chuyển hướng khách hàng đến trang cần thiết
app.get('/vnpay-return', (req, res) => {
    let verify: VerifyReturnUrl;
    try {
        // Sử dụng try-catch để bắt lỗi nếu query không hợp lệ hoặc thiếu dữ liệu
        verify = vnpay.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return res.send('Xác thực tính toàn vẹn dữ liệu thất bại');
        }
        if (!verify.isSuccess) {
            return res.send('Đơn hàng thanh toán thất bại');
        }
    } catch (error) {
        return res.send('Dữ liệu không hợp lệ');
    }

    // Kiểm tra thông tin đơn hàng và xử lý tương ứng
    // Chỉ xử lý liên quan đến UI ở đây, không xử lý logic kinh doanh
    // Logic kinh doanh quan trọng phải được xử lý ở phía server bằng IPN

    return res.send('Xác thực URL trả về thành công');
});
```
