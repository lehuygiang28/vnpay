# vnpay

<div style="text-align: center;">
    <h5>
        <a href="./README.vi_vn.md">VI</a>
        |
        <a href="./README.md">EN</a>
    </h5>
</div>
<br/>

<strong>Thư viện hỗ trợ thanh toán qua [VNPay](https://vnpay.vn).</strong>

VNPay documents: [https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)

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

1. `buildPaymentUrl(payload: BuildPaymentUrlDTO): Promise<string>`: Tạo url thanh toán

2. `verifyReturnUrl(vnpayReturnQuery: ReturnQueryFromVNPayDTO): Promise<VerifyReturnUrlDTO>`: Xác thực kết quả trả về từ VNPay

-   Import:

```typescript
// ES Modules
import { VNPay } from 'vnpay';

// CommonJS
const { VNPay } = require('vnpay');
```

-   Khởi tạo:

```typescript
// Create instance
const vnpayInstance = new VNPay({
    paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', //your payment gateway, default is sandbox
    tmnCode: 'TMNCODE', // your tmn code
    secureSecret: 'SERCRET', // your secure secret
    returnUrl: 'http://localhost:8888/order/vnpay_return', // return url
});
```

-   Tạo url thanh toán:

```typescript
// Build payment url
const urlString = await vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // amount in VND
    vnp_IpAddr: '192.168.0.1', // customer ip address
    vnp_TxnRef: '12345678', // your transaction reference
    vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
});
```

-   Xác thực kết quả trả về từ VNPay:

```typescript
/**
 * Verify response from VNPay
 * Step 1: Get the response query from VNPay with GET method, in return url
 * Return url is passing to VNPay in buildPaymentUrl method
 * @example example below in expressjs
 */
router.get('/order/vnpay_return', async (req, res) => {
    // `req.query` is the query string from VNPay
    const verifyResult = await vnpay.verifyReturnUrl(req.query);
});
```

## Contribution

<a href="https://github.com/lehuygiang28/regex-vietnamese/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/regex-vietnamese" />
</a>
