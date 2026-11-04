<div align="center">

# 📦 vnpayjs

[🇻🇳 Tiếng Việt](./README.md) | [🇺🇸 English](./README_en-US.md)

[![NPM Version](https://img.shields.io/npm/v/vnpay)](https://www.npmjs.com/package/vnpay)
[![Package License](https://img.shields.io/npm/l/vnpay)](https://www.npmjs.com/package/vnpay)
[![NPM Downloads](https://img.shields.io/npm/d18m/vnpay)](https://www.npmjs.com/package/vnpay)
[![GitHub Stars](https://img.shields.io/github/stars/lehuygiang28/vnpay)](https://github.com/lehuygiang28/vnpay)
[![GitHub Issues](https://img.shields.io/github/issues/lehuygiang28/vnpay)](https://github.com/lehuygiang28/vnpay/issues)
[![Coverage](https://img.shields.io/codecov/c/github/lehuygiang28/vnpay)](https://codecov.io/gh/lehuygiang28/vnpay)

**🚀 Thư viện Node.js hiện đại cho tích hợp cổng thanh toán [VNPay](https://vnpay.vn) vào ứng dụng của bạn.**

_Hỗ trợ TypeScript • Tree-shaking • Modular imports • Minimal dependencies_

</div>

---

## ✨ Tính năng nổi bật

<div align="center">

|    🎯 **Dễ sử dụng**     |   🧩 **Modular**   | 📘 **TypeScript** |   ⚡ **Tối ưu**    |
| :----------------------: | :----------------: | :---------------: | :----------------: |
| API đơn giản & trực quan | Import theo module | Full type support | Tree-shaking ready |

</div>

### 🆕 **Mới trong v2.4.0**

- 📦 **Import theo module** - Giảm kích thước bundle lên đến 80%
- 🎯 **Types-only imports** - 0KB runtime cho TypeScript projects
- ⚡ **Tối ưu build** - Code splitting và tree-shaking
- 🔧 **Flexible endpoints** - Custom API endpoints

---

## 📚 Tài liệu

<div align="center">

| 📖 **Tài liệu**     | 🔗 **Link**                                                            | 📝 **Mô tả**                |
| :------------------ | :--------------------------------------------------------------------- | :-------------------------- |
| **Docs chính thức** | [vnpay.js.org](https://vnpay.js.org/)                                  | Tài liệu chi tiết với ví dụ |
| **VNPay API**       | [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)         | Tài liệu chính thức VNPay   |
| **GitHub**          | [github.com/lehuygiang28/vnpay](https://github.com/lehuygiang28/vnpay) | Source code & Issues        |

</div>

---

## 🚀 Cài đặt

> [!TIP]
> **NestJS users**: Sử dụng [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - wrapper tích hợp sẵn cho NestJS.

```bash
# NPM
npm install vnpay

# Yarn
yarn add vnpay

# PNPM
pnpm install vnpay
```

---

## 📦 Import Options (v2.4.0+)

### 🏆 Import toàn bộ (Backward Compatible)

```typescript
import { VNPay, HashAlgorithm, ProductCode } from 'vnpay';
```

### 🦩 Import theo module (Recommended)

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

> [!WARNING]
> **⚠️ QUAN TRỌNG: Sử dụng trên Client-side (Frontend)**
>
> **Thư viện VNPay chỉ dành cho Node.js backend** vì sử dụng các module như `fs`, `crypto` và các API chỉ có trên server.
>
> **❌ KHÔNG làm thế này trong React/Vue/Angular components:**
>
> ```typescript
> import { VNPay } from 'vnpay'; // Error: Module not found: Can't resolve 'fs'
> ```
>
> **✅ SỬ DỤNG như thế này cho frontend:**
>
> ```typescript
> import type { VNPayConfig, BuildPaymentUrl, Bank, VerifyReturnUrl } from 'vnpay/types-only';
> ```
>
> - **Backend (Node.js)**: Sử dụng import bình thường để xử lý thanh toán
> - **Frontend (React/Vue/Angular)**: Chỉ import types để type checking
> - **API calls**: Gọi backend APIs từ frontend thay vì import trực tiếp

## 💡 Cách sử dụng

### 🔧 **Khởi tạo VNPay**

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    // ⚡ Cấu hình bắt buộc
    tmnCode: '2QXUI4B4',
    secureSecret: 'your-secret-key',
    vnpayHost: 'https://sandbox.vnpayment.vn',

    // 🔧 Cấu hình tùy chọn
    testMode: true, // Chế độ test
    hashAlgorithm: 'SHA512', // Thuật toán mã hóa
    enableLog: true, // Bật/tắt log
    loggerFn: ignoreLogger, // Custom logger

    // 🔧 Custom endpoints
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});
```

### 💳 **Tạo URL thanh toán**

```typescript
const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // 100,000 VND
    vnp_IpAddr: '192.168.1.1',
    vnp_ReturnUrl: 'https://yourapp.com/return',
    vnp_TxnRef: 'ORDER_123',
    vnp_OrderInfo: 'Thanh toán đơn hàng #123',
});

console.log('Payment URL:', paymentUrl);
```

### ✅ **Xác thực thanh toán**

```typescript
// Xác thực URL return. `isSuccess` chỉ có nghĩa khi chữ ký hợp lệ.
const verify = vnpay.verifyReturnUrl(req.query);
if (!verify.isVerified) {
    console.log('❌ Chữ ký không hợp lệ:', verify.message);
} else if (verify.isSuccess) {
    console.log('✅ Thanh toán thành công!', verify.message);
} else {
    console.log('❌ Thanh toán thất bại:', verify.message);
}
```

---

<!-- GitAds-Verify: AS4WTM39TY1WOG94V1FIXPB924R4LHF1 -->

[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=lehuygiang28/vnpay@github)](https://gitads.dev/v1/ad-track?source=lehuygiang28/vnpay@github)

---

## 🤝 Hỗ trợ & Đóng góp

<div align="center">

**🎉 vnpayjs là dự án mã nguồn mở và hoàn toàn miễn phí!**

_Nếu thư viện giúp ích cho bạn, hãy tặng cho project này một ⭐ hoặc mời một ly cà phê ☕ và nhấn vào các quảng cáo trên để mình nhận được 1 khoản tiền nhỏ để duy trì project_

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/lehuygiang28/vnpay?style=social)](https://github.com/lehuygiang28/vnpay)

<br/>

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank">
  <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=lehuygiang28&button_colour=1a1b27&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" height="48" alt="Buy me a coffee">
</a>
<a href="https://me.momo.vn/lehuygiang28" target="_blank">
  <img src="https://raw.githubusercontent.com/lehuygiang28/about-me/refs/heads/main/public/images/momo-donation.png" height="48" alt="Momo donation">
</a>

</div>

### 🛠️ **Tham gia đóng góp**

<div align="center">

| 📋 **Bước** | 🔗 **Hành động**                                                                |
| :---------: | :------------------------------------------------------------------------------ |
|    **1**    | Đọc [Hướng dẫn đóng góp](.github/CONTRIBUTING.md)                               |
|    **2**    | Fork repo và tạo Pull Request                                                   |
|    **3**    | Tham gia thảo luận trong [Issues](https://github.com/lehuygiang28/vnpay/issues) |

</div>

### 👥 **Contributors**

<div align="center">

_Cảm ơn tất cả những người đã đóng góp cho dự án:_

[![Contributors](https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20)](https://github.com/lehuygiang28/vnpay/graphs/contributors)

</div>

---

## 📄 Giấy phép

<div align="center">

**[MIT License](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)**

_Made with ❤️ in Vietnam_

</div>
