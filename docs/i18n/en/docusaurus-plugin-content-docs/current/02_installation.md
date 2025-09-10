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

## 📦 Import Options (v2.4.0+)

:::info New in v2.4.0
Starting from version 2.4.0, you can import specific parts of the library to reduce bundle size!
:::

### 🏆 Full Import (Backward Compatible)

```typescript
import { VNPay, HashAlgorithm, ProductCode } from 'vnpay';
```

### 🦩 Modular Imports (Recommended)

```typescript
import { VNPay } from 'vnpay/vnpay';
import { HashAlgorithm, ProductCode } from 'vnpay/enums';
import { VNP_VERSION, PAYMENT_ENDPOINT } from 'vnpay/constants';
import { resolveUrlString, dateFormat } from 'vnpay/utils';
```

### 📘 Types-only (TypeScript)

```typescript
import type { VNPayConfig, BuildPaymentUrl, Bank } from 'vnpay/types-only';
```

:::danger IMPORTANT WARNING
**VNPay library is designed exclusively for Node.js backend** and **CANNOT** be used directly in frontend applications (React, Vue, Angular, etc.) because:

- ❌ Uses Node.js modules: `fs`, `crypto`, `path`
- ❌ Contains server-side logic to secure `secureSecret`
- ❌ Will cause build errors when imported in client components
  :::

#### ❌ DON'T do this in Frontend

```typescript
import { VNPay } from 'vnpay';
```

#### ✅ CORRECT usage in Frontend

```typescript
import type { VNPayConfig, BuildPaymentUrl, Bank, VerifyReturnUrl } from 'vnpay/types-only';
```

- **Backend (Node.js)**: Use normal imports for payment processing
- **Frontend (React/Vue/Angular)**: Only import types for type checking
- **API calls**: Call the backend APIs from the frontend instead of direct imports

## Usage

### Import the Library

```typescript
// Full import (backward compatible)
import { VNPay } from 'vnpay';

// Or specific module import (recommended for smaller bundle)
import { VNPay } from 'vnpay/vnpay';
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

### ⚠️ **Client-side (Frontend) Usage Guide**

:::danger IMPORTANT WARNING
**VNPay library is designed exclusively for Node.js backend** and **CANNOT** be used directly in frontend applications (React, Vue, Angular, etc.) because:

- 🚫 Uses Node.js modules: `fs`, `crypto`, `path`
- 🚫 Contains server-side logic to secure `secureSecret`
- 🚫 Will cause build errors when imported in client components
  :::

#### ❌ **DON'T do this in Frontend**

```typescript
// 🚫 WILL CAUSE BUILD ERRORS!
import { VNPay } from 'vnpay';
// Error: Module not found: Can't resolve 'fs'
// Error: Module not found: Can't resolve 'crypto'

const MyComponent = () => {
  const vnpay = new VNPay(config); // ❌ Cannot do this in browser!
  return <div>Payment</div>;
};
```
