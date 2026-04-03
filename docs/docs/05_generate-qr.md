# Tạo mã QR thanh toán {#generate-qr}

`generateQr` gọi cổng VNPay với **`vnp_Command = genqr`**, trùng phần lớn tham số với [tạo URL thanh toán](/create-payment-url). Thư viện ký và gửi **GET** tới URL thanh toán; phản hồi là **JSON** gồm `code`, `message`, `qrcontent`.

:::tip
Chi tiết độ dài trường, mã lỗi và điều kiện merchant nằm trong **tài liệu “Merchant hosted QR”** do VNPay cung cấp. Làm theo bản họ gửi cho bạn; trang này chỉ mô tả cách dùng thư viện cho luồng đó.

Bản **PDF đặc tả** được dùng làm tham chiếu khi triển khai tính năng này có thể được **đính kèm trong** [Pull Request #46](https://github.com/lehuygiang28/vnpay/pull/46) trên GitHub (mở PR để tải hoặc xem file đính kèm).
:::

## Luồng theo đặc tả (tóm tắt)

**Request (phía merchant → VNPay)**  

- **GET** tới host thanh toán (ví dụ sandbox: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`), tham số dạng query đã ký **`vnp_SecureHash`**.  
- **`vnp_Command`**: `genqr` (thư viện gán giúp bạn).  
- Các trường khác (`vnp_TmnCode`, `vnp_TxnRef`, `vnp_Amount`, …) cần khớp đặc tả; **`vnp_Amount`**: VNPay yêu cầu **đã nhân 100** — thư viện vẫn nhận **số tiền “thường”** như trang tạo URL (tự nhân 100 khi build).

**Response (VNPay → merchant)**  

- **`Content-Type: application/json`**.  
- **`code`**: `00` là sinh QR thành công; khác `00` là lỗi (xem bảng mã trong tài liệu VNPay).  
- **`message`**: mô tả lỗi / kết quả.  
- **`qrcontent`**: chuỗi để vẽ QR hoặc deep-link; **khi `code` khác `00`**, đặc tả ghi **`qrcontent` là chuỗi rỗng**.

Trong mã lỗi, thư viện có thể **chuẩn hóa `message`** theo `vnp_Locale` (request hoặc mặc định lúc khởi tạo) để đọc dễ hơn; mã `code` vẫn là của VNPay.

:::info
**Chạy ở đâu**

- **Server** (cần `secureSecret`).  
- Node có **`fetch`** (Node 18+ thường đủ).
:::

## Ví dụ nhanh

Đặc tả QR thường yêu cầu **`vnp_CreateDate`** và **`vnp_ExpireDate`** (GMT+7, `yyyyMMddHHmmss`, `CreateDate` &lt; `ExpireDate`, trong khoảng cho phép). Ví dụ dưới dùng `dateFormat` của gói:

```typescript
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';

const start = new Date();
const end = new Date(start.getTime() + 15 * 60 * 1000); // ví dụ: hết hạn sau 15 phút

const result = await vnpay.generateQr({
    vnp_Amount: 10000,
    vnp_IpAddr: '192.168.1.1',
    vnp_TxnRef: 'ORD-123456',
    vnp_OrderInfo: 'Thanh toan don hang ORD-123456',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'https://merchant.example.com/return',
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(start),
    vnp_ExpireDate: dateFormat(end),
});

if (result.code === '00' && result.qrcontent) {
    // Vẽ QR hoặc deep-link từ result.qrcontent
} else {
    // result.qrcontent thường rỗng khi lỗi
}
```

Các trường còn lại: [bảng `BuildPaymentUrl`](/create-payment-url#build-payment-url).

## API

```ts
generateQr(
  data: BuildPaymentUrl,
  options?: GenerateQrResponseOptions
): Promise<GenerateQrResponse>
```

### Phản hồi `GenerateQrResponse` (khớp JSON của VNPay)

| Trường       | Ý nghĩa (theo đặc tả)                                      |
| ------------ | ---------------------------------------------------------- |
| `code`       | `00`: thành công, nội dung QR ở `qrcontent`                |
| `message`    | Thông tin mô tả (lỗi / trạng thái)                         |
| `qrcontent`  | Chuỗi QR; **rỗng** khi không thành công                    |

### `GenerateQrResponseOptions`

Giống logger các API khác: [LoggerOptions](/create-payment-url#logger-options).

:::note
Log ghi **`qrcontentLength`**, không ghi full `qrcontent`.
:::

## Khi có lỗi

- HTTP không OK, lỗi mạng, hoặc JSON không đọc được — promise báo lỗi.  
- Chi tiết mã **`code`** / **`message` gốc**: tài liệu Merchant hosted QR và bộ mã lỗi VNPay.

Tham chiếu thêm: [Tài liệu thanh toán PAY (VNPay)](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html).
