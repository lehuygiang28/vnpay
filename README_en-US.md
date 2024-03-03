# VNPay API Nodejs

<div style="text-align: center;">
    <h5>
        <a href="./README.vi_vn.md">VI</a>
        |
        <a href="./README.md">EN</a>
    </h5>
</div>
<br/>

<strong>An open-source library support to payment with [VNPay](https://vnpay.vn).</strong>

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

1. `buildPaymentUrl(payload: BuildPaymentUrlSchema): Promise<string>`: Build payment url with payload

2. `verifyReturnUrl(vnpayReturnQuery: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema>`: Verify return url from VNPay

3. `verifyIpnUrl(vnpayIpnQuery: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema>`: Verify ipn url from VNPay

4. `queryDr(payload: QueryDrSchema): Promise<QueryDrResponseFromVNPaySchema>`: Query result transaction

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
const vnpay = new VNPay({
    api_Host: 'https://sandbox.vnpayment.vn', //your payment gateway, default is sandbox
    tmnCode: 'TMNCODE', // your tmn code
    secureSecret: 'SERCRET', // your secure secret
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
    returnUrl: 'http://localhost:8888/order/vnpay_return', // return url
});
```

-   Verify response from VNPay:
    Notice: Don't update order status here, just update order status when verify `ipn` call from VNPay

```typescript
/**
 * Verify response from VNPay
 */
router.get('/order/vnpay_return', async (req, res) => {
    // `req.query` is the query string from VNPay
    const verifyResult = await vnpay.verifyReturnUrl(req.query);
    if (verifyResult.isSuccess) {
        // do something if verify success
        // Don't update order status here, just update order status when verify ipn call from VNPay
    } else {
        // do something if verify fail
    }
});
```

-   Verify ipn call from VNPay:

```typescript
/**
 * Verify the ipn call from VNPay
 */
router.get('/order/vnpay_ipn', async (req, res) => {
    // `req.query` is the query string from VNPay
    const verifyResult = await vnpay.verifyIpnUrl(req.query);
    if (verifyResult.isSuccess) {
        // do something if verify success
    } else {
        // do something if verify fail
    }
});
```

-   Query result transaction (QueryDr):

```typescript
const queryDrResult = await vnpay.queryDr({
    vnp_CreateDate: 20210809121212,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'hihihi',
    vnp_RequestId: '121212',
    vnp_TransactionDate: 20210809121212,
    vnp_TransactionNo: 121212,
    vnp_TxnRef: '112121',
});

console.log(queryDrResult);
```

#### Example here: [Click here](https://github.com/lehuygiang28/vnpay/blob/main/src/example.ts)

## Contribution

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay" />
</a>
