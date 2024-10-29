# vnpayjs

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
    <a href="https://www.npmjs.com/package/vnpay" target="_blank"><img src="https://img.shields.io/npm/d18m/vnpay" alt="NPM Downloads"></a>
</p>

<strong>Thư viện mã nguồn mở hỗ trợ thanh toán qua [VNPay](https://vnpay.vn).</strong>

## Tài liệu

### Tài liệu của thư viện: [vnpay.js.org](https://vnpay.js.org/)

### Tài liệu từ VNPay: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)

## Cài đặt

> [!TIP]
> Nếu bạn đang sử dụng [`Nestjs`](https://docs.nestjs.com) hãy cài đặt [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) cùng với thư viện này.

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
$ pnpm install vnpay
```

## Sử dụng

### Khởi tạo

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // tùy chọn
    hashAlgorithm: 'SHA512', // tùy chọn

    /**
     * Sử dụng enableLog để bật/tắt logger
     * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
     */
    enableLog: true, // tùy chọn

    /**
     * Hàm `loggerFn` sẽ được gọi để ghi log
     * Mặc định, loggerFn sẽ ghi log ra console
     * Bạn có thể ghi đè loggerFn để ghi log ra nơi khác
     *
     * `ignoreLogger` là một hàm không làm gì cả
     */
    loggerFn: ignoreLogger, // tùy chọn
});
```

## Hỗ trợ

### Thư viện VNPay là một dự án mã nguồn mở và miễn phí. Nếu bạn thấy nó hữu ích, hãy xem xét hỗ trợ bằng cách tặng một ⭐️ trên [GitHub](https://github.com/lehuygiang28/vnpay) và mua cho tác giả một cốc cà phê

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=lehuygiang28&button_colour=1a1b27&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" alt="Buy me a coffee">
</a>

<a href="https://me.momo.vn/lehuygiang28" target="_blank">
  <img src="https://raw.githubusercontent.com/lehuygiang28/about-me/refs/heads/main/public/images/momo-donation.png" height=48 alt="Momo donation" />
</a>

## Đóng góp

### Bắt đầu

Trước khi bắt đầu, hãy đảm bảo rằng bạn đã đọc [hướng dẫn đóng góp](.github/CONTRIBUTING.md).

### Người đóng góp

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" alt="List of Contributors"/>
</a>

## Giấy phép

**[MIT](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)**
