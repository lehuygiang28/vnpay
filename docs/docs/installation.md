---
sidebar_position: 2
---

# Hướng dẫn cài đặt

## Cài đặt với các trình quản lý thư viện

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

## Sử dụng thư viện

### Import thư viện

```typescript
import { VNPay } from 'vnpay';
```

### Khởi tạo đối tượng

```typescript
const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
    hashAlgorithm: 'SHA512', // tùy chọn
});
```
