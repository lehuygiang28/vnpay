# VNPay API Nodejs

<div style="text-align: center;">
    <h5>
        <a href="./README.vi_vn.md">VI</a>
        |
        <a href="./README.md">EN</a>
    </h5>
</div>
<br/>

<strong>A library support to payment with [VNPay](https://vnpay.vn).</strong>

VNPay documents: [https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)

## Installation:

Install `vnpay` with `npm`:

```bash
npm install vnpay
```

Install `vnpay` with `yarn`:

```bash
yarn add vnpay
```

Install `vnpay` with `pnpm`:

```bash
pnpm add vnpay
```

## Usage:

#### Methods

1. `buildPaymentUrl(payload: BuildPaymentUrlDTO): Promise<string>`: Build payment url with payload

2. `verifyReturnUrl(vnpayReturnQuery: ReturnQueryFromVNPayDTO): Promise<VerifyReturnUrlDTO>`: Verify return url from VNPay

-   Import:

```typescript
// ES Modules
import { VNPay } from 'vnpay';

// CommonJS
const { VNPay } = require('vnpay');
```

-   Create instance:

```typescript
// Create instance
const vnpayInstance = new VNPay({
    paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', //your payment gateway, default is sandbox
    tmnCode: 'TMNCODE', // your tmn code
    secureSecret: 'SERCRET', // your secure secret
    returnUrl: 'http://localhost:8888/order/vnpay_return', // return url
});
```

-   Build/create payment url:

```typescript
// Build payment url
const urlString = await vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // amount in VND
    vnp_IpAddr: '192.168.0.1', // customer ip address
    vnp_TxnRef: '12345678', // your transaction reference
    vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
});
```

-   Verify response from VNPay:

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
