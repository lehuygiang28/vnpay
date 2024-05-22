# VNPay Lib

<div style="text-align: center;">
    <h5>
        <a href="./README.md">VI</a>
        |
        <a href="./README_en-US.md">EN</a>
    </h5>
</div>
<br/>

<p align="center">
<a href="https://www.npmjs.com/package/vnpay" target="_blank"><img src="https://img.shields.io/npm/v/vnpay" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/vnpay" target="_blank"><img src="https://img.shields.io/npm/l/vnpay" alt="Package License"><a>
<a href="https://www.npmjs.com/package/vnpay" target="_blank"><img src="https://img.shields.io/npm/dm/vnpay" alt="NPM Downloads"></a>
</p>

<strong>Thư viện mã nguồn mở hỗ trợ thanh toán qua [VNPay](https://vnpay.vn).</strong>

## Tài liệu

### Tài liệu của thư viện: [vnpay-lib.vercel.app](https://vnpay-lib.vercel.app/)

### Tài liệu từ VNPay: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)

## Cài đặt:

Cài đặt `vnpay` với `npm`:

```bash
$ npm install vnpay
```

Cài đặt `vnpay` với `yarn`:

```bash
$ yarn add vnpay
```

Cài đặt `vnpay` với `pnpm`:

```bash
$ pnpm add vnpay
```

## Sử dụng:

#### Khởi tạo

```typescript
import { VNPay } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: 'SHA512', // optional
});
```

## Hỗ trợ

#### Thư viện VNPay là một dự án mã nguồn mở và miễn phí. Nếu bạn thấy nó hữu ích, hãy xem xét hỗ trợ bằng cách tặng một ⭐️ trên [GitHub](https://github.com/lehuygiang28/vnpay) và mua tác giả một cốc cà phê.

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

## Đóng góp

### Bắt đầu

Trước khi bắt đầu, hãy đảm bảo rằng bạn đã đọc [hướng dẫn đóng góp](.github/CONTRIBUTING.md).

### Người đóng góp

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" />
</a>
