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

#### Các phương thức

<table>
    <thead>
        <tr>
            <th>Phương thức</th>
            <th>Tham số</th>
            <th>Kiểu trả vê</th>
            <th>Mô Tả</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>buildPaymentUrl</code></td>
            <td><code>data: BuildPaymentUrl</code></td>
            <td><code>Promise&lt;string&gt;</code></td>
            <td>Tạo đường dẫn thanh toán</td>
        </tr>
        <tr>
            <td><code>verifyIpnCall</code></td>
            <td><code>query: ReturnQueryFromVNPay</code></td>
            <td><code>Promise&lt;VerifyIpnCall&gt;</code></td>
            <td>Xác thực lời gọi <a href="https://en.wikipedia.org/wiki/Instant_payment_notification" target="_blank">ipn</a> từ VNPay</td>
        </tr>
        <tr>
            <td><code>verifyReturnUrl</code></td>
            <td><code>query: ReturnQueryFromVNPay</code></td>
            <td><code>Promise&lt;VerifyReturnUrl&gt;</code></td>
            <td>Xác thực kết quả trả về từ VNPay</td>
        </tr>
        <tr>
            <td><code>queryDr</code></td>
            <td><code>data: QueryDr</code></td>
            <td><code>Promise&lt;QueryDrResponseFromVNPay&gt;</code></td>
            <td>Truy vấn kết quả giao dịch</td>
        </tr>
    </tbody>
</table>

#### Code tham khảo: <a href="https://github.com/lehuygiang28/vnpay/blob/main/example/express.ts" target="_blank">Bấm vào đây</a>

## Contribution

<a href="https://github.com/lehuygiang28/regex-vietnamese/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay" />
</a>
