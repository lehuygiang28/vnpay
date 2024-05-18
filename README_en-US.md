# VNPay API Nodejs

<div style="text-align: center;">
    <h5>
        <a href="./README.md">VI</a>
        |
        <a href="./README_en-US.md">EN</a>
    </h5>
</div>
<br/>

<strong>An open-source library support to payment with [VNPay](https://vnpay.vn).</strong>

## Documentations

### Documentation of the library: [vnpay-lib.vercel.app](https://vnpay-lib.vercel.app/)

### VNPay documentation: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)

## Installation:

Install `vnpay` with `npm`:

```bash
$ npm install vnpay
```

Install `vnpay` with `yarn`:

```bash
$ yarn add vnpay
```

Install `vnpay` with `pnpm`:

```bash
$ pnpm add vnpay
```

## Usage:

#### Initialize

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

## Support

#### `VNPay` is an open-source and free project. If you find it useful, please consider supporting it by starring ⭐️ the repository and buying me a coffee.

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Contribution

### Getting Started

Before contributing, please read our [Contribution Guidelines](.github/CONTRIBUTING.md).

### Contributors

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" />
</a>
