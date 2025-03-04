# Xác thực lời gọi IPN

Khi thanh toán hoàn tất, VNPay sẽ gửi một thông báo IPN (Instant Payment Notification) đến URL IPN mà bạn đã cấu hình. Để xác thực thông báo IPN này, bạn sử dụng thư viện VNPay.

## Xác thực IPN

```typescript
import { VerifyIpnCall } from 'vnpay';

/* ... */

const verify: VerifyIpnCall = vnpay.verifyIpnCall(req.query);
```

## Thuộc tính của đối tượng `VerifyIpnCall` {#properties-of-the-verify-ipn-call}

Thông tin sau khi xác thực và được trả về từ VNPay:

| Thuộc tính  | Kiểu dữ liệu | Mô tả                                                                                                                                         |
| ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess   | boolean      | Kết quả của đơn hàng thanh toán                                                                                                               |
| isVerified  | boolean      | Kết quả xác thực tính toàn vẹn của dữ liệu nhận được từ VNPay                                                                                |
| message     | string       | Thông điệp xác thực                                                                                                                           |
| vnp_Amount  | number       | Số tiền thanh toán, đã được thư viện tự động tính toán                                                                                        |
| ...         | ...          | Các tham số khác mà VNPay trả về, tham khảo [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1) |

Xem thêm các thuộc tính mà VNPay sẽ trả về tại [tài liệu chính thức](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1).
:::tip
Tất cả các tham số được VNPay trả về đều có trong đối tượng `VerifyIpnCall`.
:::

## Cách sử dụng

### Sử dụng Logger

- Tương tự như khi tạo URL thanh toán, bạn có thể sử dụng logger để ghi log thông tin xác thực IPN 
  [xem tại đây](/create-payment-url#using-logger).

### Với Express

Các bước xác thực thông báo IPN trong Express:

1. Tạo một route để xử lý thông báo IPN
2. Xác thực thông báo IPN
3. Xử lý thông tin trả về từ VNPay
4. Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu của bạn
5. Cập nhật trạng thái trở lại cho VNPay để xác nhận rằng bạn đã nhận và xử lý đơn hàng

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

        if (!verify.isSuccess) {
            return res.json(IpnUnknownError);
        }

        // Tìm đơn hàng trong cơ sở dữ liệu
        const foundOrder = await findOrderById(verify.vnp_TxnRef); // Phương thức tìm đơn hàng theo id, bạn cần tự triển khai

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
         * Sau khi xác thực đơn hàng thành công,
         * bạn có thể cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
         */
        foundOrder.status = 'completed';
        await updateOrder(foundOrder); // Hàm cập nhật trạng thái đơn hàng, bạn cần tự triển khai

        // Sau đó cập nhật trạng thái trở lại cho VNPay để họ biết bạn đã xác nhận đơn hàng
        return res.json(IpnSuccess);
    } catch (error) {
        /**
         * Xử lý các ngoại lệ
         * Ví dụ: dữ liệu không đủ, dữ liệu không hợp lệ, lỗi cập nhật cơ sở dữ liệu
         */
        console.log(`verify error: ${error}`);
        return res.json(IpnUnknownError);
    }
});
```
