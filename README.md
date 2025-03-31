<div align="center">

# 📦 vnpayjs

[🇻🇳 Tiếng Việt](./README.md) | [🇺🇸 English](./README_en-US.md)

[![NPM Version](https://img.shields.io/npm/v/vnpay)](https://www.npmjs.com/package/vnpay)
[![Package License](https://img.shields.io/npm/l/vnpay)](https://www.npmjs.com/package/vnpay)
[![NPM Downloads](https://img.shields.io/npm/d18m/vnpay)](https://www.npmjs.com/package/vnpay)

**Thư viện Node.js tích hợp cổng thanh toán [VNPay](https://vnpay.vn) vào ứng dụng của bạn.**

</div>

## 📚 Tài liệu

**Thư viện VNPay:**
- [vnpay.js.org](https://vnpay.js.org/) - Tài liệu chi tiết của thư viện
- [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis) - Tài liệu tích hợp từ VNPay

## 🚀 Cài đặt

> [!TIP]
> Nếu bạn đang sử dụng [`Nestjs`](https://docs.nestjs.com), hãy cài đặt [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - một wrapper tích hợp sẵn cho NestJS.

```bash
# NPM
npm install vnpay

# Yarn
yarn add vnpay

# PNPM
pnpm install vnpay
```

## 💡 Cách sử dụng

### Khởi tạo VNPay

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    // Thông tin cấu hình bắt buộc
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    
    // Cấu hình tùy chọn
    testMode: true,                // Chế độ test
    hashAlgorithm: 'SHA512',      // Thuật toán mã hóa
    enableLog: true,              // Bật/tắt ghi log
    loggerFn: ignoreLogger,       // Hàm xử lý log tùy chỉnh
    
    // Tùy chỉnh endpoints cho từng phương thức API (mới)
    // Hữu ích khi VNPay thay đổi endpoints trong tương lai
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',          // Endpoint thanh toán
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Endpoint tra cứu & hoàn tiền
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list', // Endpoint lấy danh sách ngân hàng
    }
});
```

## 🤝 Hỗ trợ & Đóng góp

**vnpayjs là một dự án mã nguồn mở và miễn phí**

Nếu bạn thấy thư viện hữu ích, hãy:
- Tặng sao ⭐️ trên [GitHub](https://github.com/lehuygiang28/vnpay)
- Mời tác giả một ly cà phê ☕️

<div align="center">

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=lehuygiang28&button_colour=1a1b27&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" height="48" alt="Buy me a coffee"></a>
<a href="https://me.momo.vn/lehuygiang28" target="_blank"><img src="https://raw.githubusercontent.com/lehuygiang28/about-me/refs/heads/main/public/images/momo-donation.png" height="48" alt="Momo donation"></a>

</div>

### Tham gia đóng góp

Tham gia phát triển dự án:
1. Đọc [hướng dẫn đóng góp](.github/CONTRIBUTING.md)
2. Fork dự án và tạo Pull Request
3. Tham gia thảo luận trong [Issues](https://github.com/lehuygiang28/vnpay/issues)

### Những người đóng góp

Cảm ơn tất cả những người đã đóng góp cho dự án:

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20)](https://github.com/lehuygiang28/vnpay/graphs/contributors)

</div>

## 📄 Giấy phép

[MIT](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)
