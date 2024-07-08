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

<strong>An open-source library support to payment with [VNPay](https://vnpay.vn).</strong>

## Documentations

### Documentation of the library: [vnpay.js.org](https://vnpay.js.org/)

### VNPay documentation: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis)

## Installation

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
$ pnpm install vnpay
```

## Usage

### Initialize

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: 'SHA512', // optional

    /**
     * On/off logger
     * If enableLog is false, loggerFn will not be used in any method
     */
    enableLog: true, // optional

    /**
     * `loggerFn` will be called to write log when enableLog is true
     * By default, loggerFn will write log to console
     * If you want to write log to other place, you can provide other function here
     *
     * `ignoreLogger` is a function do nothing
     *
     */
    loggerFn: ignoreLogger, // optional
});
```

## Support

### `VNPay` is an open-source and free project. If you find it useful, please consider supporting it by starring ⭐️ the repository on [Github](https://github.com/lehuygiang28/vnpay) and buying me a coffee

<a href="https://www.buymeacoffee.com/lehuygiang28" target="_blank">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=lehuygiang28&button_colour=1a1b27&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" alt="Buy me a coffee">
</a>

<a href="https://me.momo.vn/lehuygiang28" target="_blank">
  <img src="https://lehuygiang28.github.io/about-me/public/images/momo-donation.png" height=48 />
</a>

## Contribution

### Getting Started

Before contributing, please read our [Contribution Guidelines](.github/CONTRIBUTING.md).

### Contributors

<a href="https://github.com/lehuygiang28/vnpay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay&max=20" alt="List of Contributors"/>
</a>

## License

**[MIT](LICENSE) © [Lê Huy Giang](https://github.com/lehuygiang28)**
