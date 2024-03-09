# VNPay API Nodejs

<div style="text-align: center;">
    <h5>
        <a href="./README.md">VI</a>
        |
        <a href="./README_en-US.md">EN</a>
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

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>getBankList</code></td>
            <td>Get VNPay support bank list</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>buildPaymentUrl</code></td>
            <td>Build payment url with data</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>verifyIpnUrl</code></td>
            <td>Verify <a href="https://en.wikipedia.org/wiki/Instant_payment_notification" target="_blank">ipn</a> call from VNPay</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>verifyReturnUrl</code></td>
            <td>Verify return url from VNPay</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>queryDr</code></td>
            <td>Query result transaction</td>
            <td style="text-align:center">✅</td>
        </tr>
        <tr>
            <td><code>refund</code></td>
            <td>Request refund</td>
            <td style="text-align:center">✅</td>
        </tr>
    </tbody>
</table>

_Note:_

-   The ✅ icon indicates that the task has been completed.
-   The 📝 icon indicates that the task is todo.
-   The ❗ icon indicates that the task needs help.

#### Example here: <a href="https://github.com/lehuygiang28/vnpay/blob/main/example/express.ts" target="_blank">Click here</a>

## Contribution

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay" />
</a>
