# Class: VNPay

Lớp hỗ trợ thanh toán qua VNPay

## En

VNPay class to support VNPay payment

## See

https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

## Example

```ts
import { VNPay } from 'vnpay';

const vnpay = new VNPay({
    api_Host: 'https://sandbox.vnpayment.vn',
    tmnCode: 'TMNCODE',
    secureSecret: 'SERCRET',
    testMode: true, // optional
    hashAlgorithm: 'SHA512', // optional
    paymentEndpoint: 'paymentv2/vpcpay.html', // optional
});

const tnx = '12345678'; // Generate your own transaction code
const urlString = vnpay.buildPaymentUrl({
    vnp_Amount: 100000,
     vnp_IpAddr: '192.168.0.1',
     vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
     vnp_TxnRef: tnx,
     vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
}),
```

## Constructors

### new VNPay()

> **new VNPay**(`__namedParameters`): [`VNPay`](VNPay.md)

#### Parameters

• **\_\_namedParameters**: [`VNPayConfig`](../type-aliases/VNPayConfig.md)

#### Returns

[`VNPay`](VNPay.md)

#### Source

[vnpay.ts:75](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L75)

## Properties

### BUFFER\_ENCODE

> `private` **BUFFER\_ENCODE**: `BufferEncoding` = `'utf-8'`

#### Source

[vnpay.ts:71](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L71)

***

### HASH\_ALGORITHM

> `private` **HASH\_ALGORITHM**: [`HashAlgorithm`](../enumerations/HashAlgorithm.md) = `HashAlgorithm.SHA512`

#### Source

[vnpay.ts:70](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L70)

***

### globalDefaultConfig

> `private` **globalDefaultConfig**: [`GlobalConfig`](../type-aliases/GlobalConfig.md)

#### Source

[vnpay.ts:69](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L69)

***

### isEnableLog

> `private` **isEnableLog**: `boolean` = `false`

#### Source

[vnpay.ts:72](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L72)

## Accessors

### defaultConfig

> `get` **defaultConfig**(): [`DefaultConfig`](../type-aliases/DefaultConfig.md)

Lấy cấu hình mặc định của VNPay

#### En

Get default config of VNPay

#### Returns

[`DefaultConfig`](../type-aliases/DefaultConfig.md)

#### Source

[vnpay.ts:118](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L118)

## Methods

### buildPaymentUrl()

> **buildPaymentUrl**\<`LoggerFields`\>(`data`, `options`?): `string`

Phương thức xây dựng, tạo thành url thanh toán của VNPay

#### Type parameters

• **LoggerFields** *extends* `"vnp_Version"` \| `"vnp_Command"` \| `"createdAt"` \| `"paymentUrl"` \| `"vnp_TmnCode"` \| keyof BuildPaymentUrl \| `"method"`

#### Parameters

• **data**: [`BuildPaymentUrl`](../type-aliases/BuildPaymentUrl.md)

Payload that contains the information to build the payment url

• **options?**: [`BuildPaymentUrlOptions`](../type-aliases/BuildPaymentUrlOptions.md)\<`LoggerFields`\>

#### Returns

`string`

The payment url string

#### En

Build the payment url

#### See

https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan

#### Source

[vnpay.ts:162](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L162)

***

### getBankList()

> **getBankList**(): `Promise`\<`Bank`[]\>

#### Returns

`Promise`\<`Bank`[]\>

#### Source

[vnpay.ts:129](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L129)

***

### globalLoggerFn()

> `private` `readonly` **globalLoggerFn**(`data`): `void`

#### Parameters

• **data**: `unknown`

#### Returns

`void`

#### Source

[vnpay.ts:73](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L73)

***

### logData()

> `private` **logData**\<`T`, `LoggerFields`\>(`data`, `options`?): `void`

#### Type parameters

• **T** *extends* `object`

• **LoggerFields** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **data**: `T`

• **options?**: [`LoggerOptions`](../type-aliases/LoggerOptions.md)\<`T`, `LoggerFields`\>

#### Returns

`void`

#### Source

[vnpay.ts:532](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L532)

***

### queryDr()

> **queryDr**(`query`): `Promise`\<`QueryDrResponseFromVNPay`\>

Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.

#### Parameters

• **query**: [`QueryDr`](../type-aliases/QueryDr.md)

The data to query

#### Returns

`Promise`\<`QueryDrResponseFromVNPay`\>

The data return from VNPay

#### En

This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.

#### See

https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY

#### Source

[vnpay.ts:348](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L348)

***

### refund()

> **refund**(`data`): `Promise`\<`object`\>

Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.

#### Parameters

• **data**: [`Refund`](../type-aliases/Refund.md)

The data to request refund

#### Returns

`Promise`\<`object`\>

The data return from VNPay

##### vnp\_Amount

> **vnp\_Amount**: `number`

Số tiền thanh toán. Đã tự động tính toán theo đơn vị của VNPay. (100 lần số tiền của đơn hàng trong cơ sở dữ liệu của bạn)

###### En

Amount of payment. Automatically calculated according to the unit of VNPay. (100 times the amount of the order in your database)

##### vnp\_BankCode

> **vnp\_BankCode**: `string`

Mã Ngân hàng hoặc mã Ví điện tử thanh toán

###### En

Bank code or account number

###### Example

```ts
NCB
```

##### vnp\_Command

> **vnp\_Command**: `string`

Mã API sử dụng, mã cho giao dịch thanh toán là "refund"

###### En

API code used for payment, the transaction code is "refund"

##### vnp\_Message

> **vnp\_Message**: `string`

##### vnp\_OrderInfo

> **vnp\_OrderInfo**: `string`

Nội dung của yêu cầu hoàn tiền

###### En

Content of the refund request

##### vnp\_PayDate

> **vnp\_PayDate**: `string` \| `number`

Thời gian thực hiện

##### vnp\_ResponseCode

> **vnp\_ResponseCode**: `number`

Mã phản hồi kết quả xử lý của API.
Quy định mã trả lời 00 ứng với yêu cầu được thực hiện thành công.
Tham khảo thêm tại bảng mã lỗi.

###### En

Response code of API
If the API is executed successfully, the value of the response code is 00.
To learn more about the response code, refer to the table below.

##### vnp\_ResponseId

> **vnp\_ResponseId**: `string`

Mã hệ thống VNPAY tự sinh ứng với mỗi yêu cầu hoàn trả giao dịch.
Mã này là duy nhất dùng để phân biệt các yêu cầu hoàn trả giao dịch.
Không được trùng lặp trong ngày

###### En

VNPAY system code automatically generated for each refund transaction request.
The system code is unique for each refund transaction request.
Not duplicated in a day.

##### vnp\_SecureHash

> **vnp\_SecureHash**: `string`

##### vnp\_TmnCode

> **vnp\_TmnCode**: `string`

Mã hệ thống VNPAY

##### vnp\_TransactionNo?

> `optional` **vnp\_TransactionNo**: `string` \| `number`

##### vnp\_TransactionStatus

> **vnp\_TransactionStatus**: `string` \| `number`

Tình trạng thanh toán của giao dịch tại Cổng thanh toán VNPAY.

###### En

Status of transaction payment at VNPAY payment gateway.

##### vnp\_TransactionType

> **vnp\_TransactionType**: [`VnpTransactionType`](../enumerations/VnpTransactionType.md)

Loại giao dịch tại hệ thống VNPAY:
- 01: GD thanh toán
- 02: Giao dịch hoàn trả toàn phần
- 03: Giao dịch hoàn trả một phần

##### vnp\_TxnRef

> **vnp\_TxnRef**: `string`

Mã tham chiếu của giao dịch tại hệ thống của merchant.
Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.
Không được trùng lặp trong ngày.

###### En

Reference code of transaction on merchant system. This code is unique to distinguish orders sent to VNPAY. Not duplicated in a day.

###### Example

```ts
123456
```

#### En

This is the API for the merchant system to refund the transaction at the VNPAY system.

#### See

https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY

#### Source

[vnpay.ts:444](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L444)

***

### verifyIpnCall()

> **verifyIpnCall**\<`LoggerFields`\>(`query`, `options`?): [`VerifyReturnUrl`](../type-aliases/VerifyReturnUrl.md)

Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay

Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay, kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.

Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`

#### Type parameters

• **LoggerFields** *extends* `"createdAt"` \| `"vnp_TmnCode"` \| `"vnp_Amount"` \| `"vnp_OrderInfo"` \| `"vnp_TxnRef"` \| `"vnp_BankCode"` \| `"method"` \| `"vnp_BankTranNo"` \| `"vnp_CardType"` \| `"vnp_PayDate"` \| `"vnp_TransactionNo"` \| `"vnp_ResponseCode"` \| `"vnp_TransactionStatus"` \| `"vnp_SecureHashType"` \| `"vnp_SecureHash"` \| `"isSuccess"` \| `"isVerified"` \| `"message"`

#### Parameters

• **query**: [`ReturnQueryFromVNPay`](../type-aliases/ReturnQueryFromVNPay.md)

The object of data return from VNPay

• **options?**: [`VerifyIpnCallOptions`](../type-aliases/VerifyIpnCallOptions.md)\<`LoggerFields`\>

#### Returns

[`VerifyReturnUrl`](../type-aliases/VerifyReturnUrl.md)

The return object

#### En

Method to verify the ipn url from VNPay

After receiving the call, the merchant system needs to verify the data received from VNPay, check if the order is valid, check if the payment amount is correct.

Then respond to VNPay the verification result through the `IpnResponse`

#### See

https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url

#### Source

[vnpay.ts:316](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L316)

***

### verifyReturnUrl()

> **verifyReturnUrl**\<`LoggerFields`\>(`query`, `options`?): [`VerifyReturnUrl`](../type-aliases/VerifyReturnUrl.md)

Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay

#### Type parameters

• **LoggerFields** *extends* `"createdAt"` \| `"vnp_TmnCode"` \| `"vnp_Amount"` \| `"vnp_OrderInfo"` \| `"vnp_TxnRef"` \| `"vnp_BankCode"` \| `"method"` \| `"vnp_BankTranNo"` \| `"vnp_CardType"` \| `"vnp_PayDate"` \| `"vnp_TransactionNo"` \| `"vnp_ResponseCode"` \| `"vnp_TransactionStatus"` \| `"vnp_SecureHashType"` \| `"vnp_SecureHash"` \| `"isSuccess"` \| `"isVerified"` \| `"message"`

#### Parameters

• **query**: [`ReturnQueryFromVNPay`](../type-aliases/ReturnQueryFromVNPay.md)

The object of data return from VNPay

• **options?**: [`VerifyReturnUrlOptions`](../type-aliases/VerifyReturnUrlOptions.md)\<`LoggerFields`\>

#### Returns

[`VerifyReturnUrl`](../type-aliases/VerifyReturnUrl.md)

The return object

#### En

Method to verify the return url from VNPay

#### See

https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl

#### Source

[vnpay.ts:232](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/vnpay.ts#L232)
