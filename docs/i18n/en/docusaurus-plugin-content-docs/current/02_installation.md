# Installation

:::tip
If you're using [`NestJS`](https://docs.nestjs.com), install [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - a ready-to-use wrapper for NestJS.
:::

## Installation with Package Managers

### NPM

```bash
$ npm install vnpay
```

### Yarn

```bash
$ yarn add vnpay
```

### PNPM

```bash
$ pnpm install vnpay
```

## Usage

### Import the Library

```typescript
import { VNPay } from 'vnpay';
```

### Initialize the Instance {#init-vnpay}

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // optional, when the url of querydr and refund is different from the payment url (usually used for production)

    testMode: true, // optional, overrides vnpayHost to sandbox if true
    hashAlgorithm: 'SHA512', // optional

    /**
     * Enable/disable logging
     * If enableLog is false, loggerFn will not be used in any method
     */
    enableLog: true, // optional

    /**
     * `loggerFn` will be called to write logs when enableLog is true
     * By default, loggerFn will write logs to the console
     * If you want to write logs elsewhere, you can provide a custom function
     *
     * `ignoreLogger` is a function that does nothing
     */
    loggerFn: ignoreLogger, // optional

    /**
     * Customize VNPay API endpoints
     * Usually doesn't need to be changed unless:
     * - VNPay updates their paths
     * - There are differences between sandbox and production environments
     */
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    }, // optional
});
```
