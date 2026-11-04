<div align="center">

# 📦 vnpayjs

[🇻🇳 Tiếng Việt](./README.md) | [🇺🇸 English](./README_en-US.md)

[![NPM Version](https://img.shields.io/npm/v/vnpay)](https://www.npmjs.com/package/vnpay)
[![Package License](https://img.shields.io/npm/l/vnpay)](https://www.npmjs.com/package/vnpay)
[![NPM Downloads](https://img.shields.io/npm/d18m/vnpay)](https://www.npmjs.com/package/vnpay)
[![GitHub Stars](https://img.shields.io/github/stars/lehuygiang28/vnpay)](https://github.com/lehuygiang28/vnpay)
[![GitHub Issues](https://img.shields.io/github/issues/lehuygiang28/vnpay)](https://github.com/lehuygiang28/vnpay/issues)
[![Coverage](https://img.shields.io/codecov/c/github/lehuygiang28/vnpay)](https://codecov.io/gh/lehuygiang28/vnpay)

**🚀 Modern Node.js library for integrating [VNPay](https://vnpay.vn) payment gateway into your applications.**

_TypeScript Support • Tree-shaking • Modular imports • Minimal dependencies_

</div>

---

## ✨ Key Features

<div align="center">

|   🎯 **Easy to Use**   |  🧩 **Modular**   | 📘 **TypeScript** |  ⚡ **Optimized**  |
| :--------------------: | :---------------: | :---------------: | :----------------: |
| Simple & intuitive API | Import by modules | Full type support | Tree-shaking ready |

</div>

### 🆕 **New in v2.4.0**

- 📦 **Modular imports** - Reduce bundle size by up to 80%
- 🎯 **Types-only imports** - 0KB runtime for TypeScript projects
- ⚡ **Optimized builds** - Code splitting and tree-shaking
- 🔧 **Flexible endpoints** - Custom API endpoints

---

## 📚 Documentation

<div align="center">

| 📖 **Documentation** | 🔗 **Link**                                                            | 📝 **Description**                   |
| :------------------- | :--------------------------------------------------------------------- | :----------------------------------- |
| **Official Docs**    | [vnpay.js.org](https://vnpay.js.org/)                                  | Detailed documentation with examples |
| **VNPay API**        | [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)         | Official VNPay documentation         |
| **GitHub**           | [github.com/lehuygiang28/vnpay](https://github.com/lehuygiang28/vnpay) | Source code & Issues                 |

</div>

---

## 🚀 Installation

> [!TIP]
> **NestJS users**: Use [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - a dedicated wrapper for NestJS.

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

> [!WARNING]
> **⚠️ IMPORTANT: Client-side (Frontend) Usage**
>
> **The VNPay library is designed for Node.js backends only** as it uses modules like `fs`, `crypto`, and other server-only APIs.
>
> **❌ DON'T do this in React/Vue/Angular components:**
>
> ```typescript
> import { VNPay } from 'vnpay'; // Error: Module not found: Can't resolve 'fs'
> ```
>
> **✅ DO this for frontend:**
>
> ```typescript
> import type { VNPayConfig, BuildPaymentUrl, Bank, VerifyReturnUrl } from 'vnpay/types-only';
> ```
>
> - **Backend (Node.js)**: Use normal imports for payment processing
> - **Frontend (React/Vue/Angular)**: Only import types for type checking
> - **API calls**: Call the backend APIs from the frontend instead of direct imports

---

## 💡 Usage

### 🔧 **Initialize VNPay**

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    // ⚡ Required configuration
    tmnCode: '2QXUI4B4',
    secureSecret: 'your-secret-key',
    vnpayHost: 'https://sandbox.vnpayment.vn',

    // 🔧 Optional configuration
    testMode: true, // Enable test mode
    hashAlgorithm: 'SHA512', // Hash algorithm
    enableLog: true, // Enable/disable logging
    loggerFn: ignoreLogger, // Custom logger

    // 🔧 Custom endpoints
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});
```

### 💳 **Create Payment URL**

```typescript
const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // 100,000 VND
    vnp_IpAddr: '192.168.1.1',
    vnp_ReturnUrl: 'https://yourapp.com/return',
    vnp_TxnRef: 'ORDER_123',
    vnp_OrderInfo: 'Payment for order #123',
});

console.log('Payment URL:', paymentUrl);
```

### ✅ **Verify Payment**

```typescript
// Verify the return URL. `isSuccess` is meaningful only when the signature is valid.
const verify = vnpay.verifyReturnUrl(req.query);
if (!verify.isVerified) {
    console.log('❌ Invalid signature:', verify.message);
} else if (verify.isSuccess) {
    console.log('✅ Payment successful!', verify.message);
} else {
    console.log('❌ Payment failed:', verify.message);
}
```

---

[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=lehuygiang28/vnpay@github)](https://gitads.dev/v1/ad-track?source=lehuygiang28/vnpay@github)

---

## 🤝 Support & Contribute

<div align="center">

**🎉 vnpayjs is an open-source and completely free project!**

_If this library helps you, please give us a ⭐ and buy us a coffee ☕ and click the ads above to support us_

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

### 🛠️ **How to Contribute**

<div align="center">

| 📋 **Step** | 🔗 **Action**                                                              |
| :---------: | :------------------------------------------------------------------------- |
|    **1**    | Read [Contribution Guidelines](.github/CONTRIBUTING.md)                    |
|    **2**    | Fork repo and create Pull Request                                          |
|    **3**    | Join discussions in [Issues](https://github.com/lehuygiang28/vnpay/issues) |

</div>

### 👥 **Contributors**

<div align="center">

_Thanks to all contributors who have helped shape this project:_

[![Contributors](https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20)](https://github.com/lehuygiang28/vnpay/graphs/contributors)

</div>

---

## 📄 License

<div align="center">

**[MIT License](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)**

_Made with ❤️ in Vietnam_

</div>

**💡 Check out practical examples:**

- **See [Examples](/docs/examples)** in the documentation for full-stack implementations
- **Next.js Fullstack Example**: [vnpay-nextjs-fullstack-example](https://github.com/lehuygiang28/vnpay-nextjs-fullstack-example)

```
</div>
```
