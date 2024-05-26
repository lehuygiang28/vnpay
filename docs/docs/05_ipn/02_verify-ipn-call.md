# Xác thực lời gọi IPN

Khi thanh toán hoàn tất, VNPay sẽ gửi lời gọi IPN (Instant Payment Notification) đến URL IPN mà bạn đã cài đặt. Để xác thực lời gọi IPN, bạn có thể sử dụng thư viện VNPay.

## Xác thực IPN

```typescript
import { VerifyIpnCall } from 'vnpay';

/* ... */

const verify: VerifyIpnCall = vnpay.verifyIpnCall(req.query);
```

## Các thuộc tính của đối tượng `VerifyIpnCall`

Thông tin sau khi xác thực và của VNPay trả về

| Thuộc tính | Kiểu dữ liệu | Mô tả                                                                                                                                                      |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess  | boolean      | Kết quả của đơn hàng thanh toán                                                                                                                            |
| isVerified | boolean      | Kết quả xác thực tính toàn vẹn của dữ liệu khi nhận về từ VNPay                                                                                            |
| message    | string       | Thông báo xác thực                                                                                                                                         |
| vnp_Amount | number       | Số tiền thanh toán, đã được tự động tính toán bởi thư viện                                                                                                 |
| ...        | ...          | Các tham số khác của VNPay sẽ trả về, tham khảo tại [đây](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1) |

Xem thêm các thuộc tính VNPay sẽ trả về tại [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1).
:::tip
Các tham số mà VNPay trả về cũng nằm trong đối tượng `VerifyIpnCall`.
:::

## Sử dụng

### Sử dụng logger

-   Tương tự như khi tạo URL thanh toán, bạn có thể sử dụng logger để ghi log thông tin xác thực IPN
    [xem tại đây](./create-payment-url.md#use-logger).

### Với Express

Các bước xác thực URL trả về trong Express:

1. Tạo một route để xử lý URL trả về
2. Xác thực URL trả về
3. Xử lý thông tin trả về từ VNPay
4. Cập nhật trạng thái đơn hàng trong database của bạn
5. Cập nhật trạng thái về cho VNPay biết rằng bạn đã xác nhận đơn hàng

```typescript title="controllers/payment.controller.ts"
import {
    IpnFailChecksum,
    IpnOrderNotFound,
    IpnInvalidAmount,
    InpOrderAlreadyConfirmed,
    IpnUnknownError,
    IpnSuccess,
} from 'vnpay';

/* ... */

app.get('/vnpay-ipn', async (req, res) => {
    try {
        const verify: VerifyReturnUrl = vnpay.verifyIpnCall(req.query);
        if (!verify.isVerified) {
            return res.json(IpnFailChecksum);
        }

        // Tìm đơn hàng trong database của bạn
        const foundOrder = await findOrderById(verify.vnp_TxnRef); // Hàm tìm đơn hàng theo id, bạn cần tự cài đặt

        // Nếu không tìm thấy đơn hàng hoặc mã đơn hàng không khớp
        if (!foundOrder || verify.vnp_TxnRef !== foundOrder.orderId) {
            return res.json(IpnOrderNotFound);
        }

        // Nếu số tiền thanh toán không khớp
        if (verify.vnp_Amount !== foundOrder.amount) {
            return res.json(IpnInvalidAmount);
        }

        // Nếu đơn hàng đã được xác nhận trước đó
        if (foundOrder.status === 'completed') {
            return res.json(InpOrderAlreadyConfirmed);
        }

        /**
         * Sau khi xác thực đơn hàng hoàn tất,
         * bạn có thể cập nhật trạng thái đơn hàng trong database của bạn
         */
        foundOrder.status = 'completed';
        await updateOrder(foundOrder); // Hàm cập nhật trạng thái đơn hàng, bạn cần tự cài đặt

        // Sau đó cập nhật trạng thái về cho VNPay biết rằng bạn đã xác nhận đơn hàng
        return res.json(IpnSuccess);
    } catch (error) {
        /**
         * Xử lí lỗi ngoại lệ
         * Ví dụ như không đủ dữ liệu, dữ liệu không hợp lệ, cập nhật database thất bại
         */
        console.log(`verify error: ${error}`);
        return res.json(IpnUnknownError);
    }
});
```
