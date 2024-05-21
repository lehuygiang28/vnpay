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

### Khởi tạo đối tượng {#init-vnpay}

```typescript
import { ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
    hashAlgorithm: 'SHA512', // tùy chọn

    /**
     * Sử dụng enableLog để bật/tắt logger
     * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
     */
    enableLog: true, // optional

    /**
     * Hàm `loggerFn` sẽ được gọi để ghi log
     * Mặc định, loggerFn sẽ ghi log ra console
     * Bạn có thể ghi đè loggerFn để ghi log ra nơi khác
     *
     * `ignoreLogger` là một hàm không làm gì cả
     */
    loggerFn: ignoreLogger, // optional
});
```
