---
sidebar_position: 2
---

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
$ pnpm add vnpay
```

## Using

### Import the library

```typescript
import { VNPay } from 'vnpay';
```

### Initialize the instance

```typescript
const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional, overrides vnpayHost to sandbox if true
    hashAlgorithm: 'SHA512', // optional
});
```
