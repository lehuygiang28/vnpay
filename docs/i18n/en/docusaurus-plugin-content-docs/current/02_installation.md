# Installation

## Installation with package managers

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

### Import the library

```typescript
import { VNPay } from 'vnpay';
```

### Initialize the instance {#init-vnpay}

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional, overrides vnpayHost to sandbox if true
    hashAlgorithm: 'SHA512', // optional

    /**
     * On/off logger
     * If enableLog is false, loggerFn will not be used in any method
     */
    enableLog: true, // optional

    /**
     * `loggerFn` will be called to write log when enableLog is true
     * By default, loggerFn will write log to console
     * If you want to write log to other place, you can provide other function here
     *
     * `ignoreLogger` is a function do nothing
     *
     */
    loggerFn: ignoreLogger, // optional
});
```
