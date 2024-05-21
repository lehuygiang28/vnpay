# Type alias: VNPayConfig

> **VNPayConfig**: `object`

## Type declaration

### enableLog?

> `optional` **enableLog**: `boolean`

Bật chức năng logging

Disable it, then no logger will be used in any method

#### En

Enable logging feature

#### Default

```ts
false
```

### hashAlgorithm?

> `optional` **hashAlgorithm**: [`HashAlgorithm`](../enumerations/HashAlgorithm.md)

Thuật toán mã hóa

#### En

Hash algorithm

#### Default

```ts
'SHA512'
```

### loggerFn()?

> `optional` **loggerFn**: (`data`) => `void`

Phương thức cho phép bạn tự tùy chỉnh log

- data có thể thay đổi theo từng method khác nhau

#### En

Method that allows you to customize the log

#### Parameters

• **data**: `unknown`

Data to log, it can be change to each method

#### Returns

`void`

### paymentEndpoint?

> `optional` **paymentEndpoint**: `string`

Payment endpoint API của VNPay

#### En

Payment endpoint of VNPay

#### Default

```ts
'paymentv2/vpcpay.html'
```

#### Example

```ts
'paymentv2/vpcpay.html'
```

### secureSecret

> **secureSecret**: `string`

Mật khẩu bảo mật của đối tác

#### En

Secure secret of merchant

### testMode?

> `optional` **testMode**: `boolean`

Khi được bật, chế độ test sẽ tự động ghi đè `vnpayHost` thành sandbox

#### En

When using test mode, `vnpayHost` should be set to sandbox

#### Default

```ts
false
```

### tmnCode

> **tmnCode**: `string`

Mã tmn của đối tác

#### En

Merchant tmn code

### vnp\_CurrCode?

> `optional` **vnp\_CurrCode**: [`VnpCurrCode`](../enumerations/VnpCurrCode.md)

Đơn vị tiền tệ

#### En

Currency code

### vnp\_Locale?

> `optional` **vnp\_Locale**: [`VnpLocale`](../enumerations/VnpLocale.md)

Ngôn ngữ hiển thị trên cổng thanh toán

#### En

Language display on payment gateway

### vnp\_Version?

> `optional` **vnp\_Version**: `string`

Phiên bản của API VNPay

#### En

Version of VNPay API

### vnpayHost?

> `optional` **vnpayHost**: `string`

Đường dẫn tới Host API của VNPay

#### En

API host url of VNPay

#### Default

```ts
'https://sandbox.vnpayment.vn'
```

#### Example

```ts
'https://sandbox.vnpayment.vn'
```

## Source

[types/vnpay-config.type.ts:3](https://github.com/lehuygiang28/vnpay/blob/e8e94e8a800b1952e47648e8b76237a738bccbb7/src/types/vnpay-config.type.ts#L3)
