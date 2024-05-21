# Type alias: ReturnQueryFromVNPay

> **ReturnQueryFromVNPay**: `Pick` \<[`BuildPaymentUrl`](BuildPaymentUrl.md), `"vnp_OrderInfo"` \| `"vnp_TxnRef"`\> & `object`

## Type declaration

### vnp\_Amount

> **vnp\_Amount**: `number` \| `string`

Số tiền thanh toán

### vnp\_BankCode?

> `optional` **vnp\_BankCode**: `string`

Mã Ngân hàng thanh toán

#### En

Bank code

#### Example

```ts
NCB
```

### vnp\_BankTranNo?

> `optional` **vnp\_BankTranNo**: `string`

Mã giao dịch tại Ngân hàng

#### En

Transaction code at bank

#### Example

```ts
NCB20170829152730
```

### vnp\_CardType?

> `optional` **vnp\_CardType**: [`VnpCardType`](../enumerations/VnpCardType.md) \| `string`

Loại tài khoản/thẻ khách hàng sử dụng:`ATM`,`QRCODE`

#### En

Type of customer account/card used: `ATM`, `QRCODE`

#### Example

```ts
ATM
```

### vnp\_PayDate?

> `optional` **vnp\_PayDate**: `number` \| `string`

Thời gian thanh toán. Định dạng: yyyyMMddHHmmss

#### En

Payment time. Format: yyyyMMddHHmmss

#### Example

```ts
20170829152730
```

### vnp\_ResponseCode

> **vnp\_ResponseCode**: `number` \| `string`

Mã phản hồi kết quả thanh toán. Quy định mã trả lời 00 ứng với kết quả Thành công cho tất cả các API.

#### En

Response code of payment result. The response code 00 corresponds to the Successful result for all APIs.

#### Example

```ts
00
```

#### See

https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/

### vnp\_SecureHash?

> `optional` **vnp\_SecureHash**: `string`

Mã kiểm tra (checksum) để đảm bảo dữ liệu của giao dịch không bị thay đổi trong quá trình chuyển từ merchant sang VNPAY.
Việc tạo ra mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng. Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.

#### En

Checksum to ensure that the transaction data is not changed during the transfer from merchant to VNPAY.
The creation of this code depends on the configuration of the merchant and the version of the api used. The current version supports `SHA256`, `HMACSHA512`.

### vnp\_SecureHashType?

> `optional` **vnp\_SecureHashType**: `string`

Mã kiểu bảo mật sử dụng để tạo mã checksum. Mã này phụ thuộc vào cấu hình của merchant và phiên bản api sử dụng.
Phiên bản hiện tại hỗ trợ `SHA256`, `HMACSHA512`.

#### En

Security type code used to create checksum code. This code depends on the configuration of the merchant and the version of the api used.
The current version supports `SHA256`, `HMACSHA512`.

#### Example

```ts
HMACSHA512
```

### vnp\_TmnCode?

> `optional` **vnp\_TmnCode**: `string`

Mã tmn của đối tác

#### En

Merchant tmn code

### vnp\_TransactionNo?

> `optional` **vnp\_TransactionNo**: `number` \| `string`

Mã giao dịch ghi nhận tại hệ thống VNPAY.

#### En

Transaction code recorded in VNPAY system.

#### Example

```ts
20170829153052
```

### vnp\_TransactionStatus?

> `optional` **vnp\_TransactionStatus**: `number` \| `string`

Mã phản hồi kết quả thanh toán. Tình trạng của giao dịch tại Cổng thanh toán VNPAY.

-00: Giao dịch thanh toán được thực hiện thành công tại VNPAY

-Khác 00: Giao dịch không thành công tại VNPAY

#### En

Response code of payment result. Status of transaction at VNPAY payment gateway.

-00: Payment transaction is successful at VNPAY

-Other 00: Payment transaction is not successful at VNPAY

#### Example

```ts
00
```

#### See

https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/

## Source

[types/return-from-vnpay.type.ts:4](https://github.com/lehuygiang28/vnpay/blob/ffb3f1a6e2e5cee6cec7ba4f806a92950f9f7872/src/types/return-from-vnpay.type.ts#L4)
