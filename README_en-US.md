<div align="center">

# 📦 vnpayjs

[🇻🇳 Tiếng Việt](./README.md) | [🇺🇸 English](./README_en-US.md)

[![NPM Version](https://img.shields.io/npm/v/vnpay)](https://www.npmjs.com/package/vnpay)
[![Package License](https://img.shields.io/npm/l/vnpay)](https://www.npmjs.com/package/vnpay)
[![NPM Downloads](https://img.shields.io/npm/d18m/vnpay)](https://www.npmjs.com/package/vnpay)

**A Node.js library for integrating [VNPay](https://vnpay.vn) payment gateway into your applications.**

</div>

## 📚 Documentation

**VNPay Library:**
- [vnpay.js.org](https://vnpay.js.org/) - Detailed library documentation
- [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis) - VNPay integration guide

## 🚀 Installation

> [!TIP]
> If you're using [`NestJS`](https://docs.nestjs.com), install [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - a ready-to-use wrapper for NestJS.

```bash
# NPM
npm install vnpay

# Yarn
yarn add vnpay

# PNPM
pnpm install vnpay
```

## 💡 Usage

### Initialize VNPay

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    // Required configuration
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // In case the querydr and refund urls are different from the payment initiation url (usually used for production)
    
    // Optional configuration
    testMode: true,                // Enable test mode
    hashAlgorithm: 'SHA512',      // Hash algorithm
    enableLog: true,              // Enable/disable logging
    loggerFn: ignoreLogger,       // Custom logger function
    
    // Custom endpoints for each API method (new)
    // Useful when VNPay changes endpoints in the future
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',          // Payment endpoint
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Query & refund endpoint
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list', // Get bank list endpoint
    }
});
```

## 🤝 Support & Contribute

**vnpayjs is an open-source and free project**

If you find this library helpful:
- Star ⭐️ the repository on [GitHub](https://github.com/lehuygiang28/vnpay)
- Buy me a coffee ☕️

<div align="center">

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=lehuygiang28&button_colour=1a1b27&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" height="40" alt="Buy me a coffee"></a>
<a href="https://me.momo.vn/lehuygiang28" target="_blank"><img src="https://raw.githubusercontent.com/lehuygiang28/about-me/refs/heads/main/public/images/momo-donation.png" height="40" alt="Momo donation"></a>

</div>

### How to Contribute

Get involved with the project:
1. Read our [Contribution Guidelines](.github/CONTRIBUTING.md)
2. Fork the project and create a Pull Request
3. Join discussions in [Issues](https://github.com/lehuygiang28/vnpay/issues)

### Contributors

Thanks to all contributors who have helped shape this project:

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20)](https://github.com/lehuygiang28/vnpay/graphs/contributors)

</div>

## 📄 License

[MIT](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)
