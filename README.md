# vnpay

<div style="text-align: center;">
    <h5>
        <a href="./README.md">VI</a>
        |
        <a href="./README_en-US.md">EN</a>
    </h5>
</div>
<br/>

<strong>Thư viện mã nguồn mở hỗ trợ thanh toán qua [VNPay](https://vnpay.vn).</strong>

Tài liệu từ VNPay: [https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)

## Cài đặt:

Cài đặt `vnpay` với `npm`:

```bash
npm install vnpay
```

Cài đặt `vnpay` với `yarn`:

```bash
yarn add vnpay
```

Cài đặt `vnpay` với `pnpm`:

```bash
pnpm add vnpay
```

## Sử dụng:

#### Khởi tạo

```typescript
import { VNPay } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    api_Host: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: 'SHA512', // optional
});
```

#### Các phương thức

<table>
    <thead>
        <tr>
            <th>Phương thức</th>
            <th>Mô Tả</th>
            <th>Trạng thái</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>getBankList</code></td>
            <td>Lấy danh sách ngân hàng VNPay hỗ trợ</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>buildPaymentUrl</code></td>
            <td>Tạo đường dẫn thanh toán</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>verifyIpnCall</code></td>
            <td>Xác thực lời gọi <a href="https://en.wikipedia.org/wiki/Instant_payment_notification" target="_blank">ipn</a> từ VNPay</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>verifyReturnUrl</code></td>
            <td>Xác thực kết quả trả về từ VNPay</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>queryDr</code></td>
            <td>Truy vấn kết quả giao dịch</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>refund</code></td>
            <td>Tạo yêu cầu hoàn tiền</td>
            <td style="text-align:center">✅</td>
        </tr>
    </tbody>
</table>

_Ghi chú:_

-   Biểu tượng ✅ cho biết công việc đã được hoàn thành.
-   Biểu tượng 📝 cho biết công việc cần được thực hiện.
-   Biểu tượng ❗ cho biết công việc cần sự giúp đỡ.

#### Code tham khảo: <a href="https://github.com/lehuygiang28/vnpay/blob/main/example/express.ts" target="_blank">Bấm vào đây</a>

## Contribution

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" />
</a>
