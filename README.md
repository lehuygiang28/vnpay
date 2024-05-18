# vnpay

<div style="text-align: center;">
    <h5>
        <a href="./README.md">VI</a>
        |
        <a href="./README_en-US.md">EN</a>
    </h5>
</div>
<br/>

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

#### Vnpay is an open-source and free project. If you find this library useful, please give it a ⭐️ on GitHub and buy the author a cup of coffee.

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Đóng góp

### Bắt đầu

Trước khi bắt đầu, hãy đảm bảo rằng bạn đã đọc [hướng dẫn đóng góp](.github/CONTRIBUTING.md).

### Người đóng góp

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" />
</a>
