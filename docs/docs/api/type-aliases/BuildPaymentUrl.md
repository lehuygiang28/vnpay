# Type alias: BuildPaymentUrl

> **BuildPaymentUrl**: `object`

## Type declaration

### vnp\_Amount

> **vnp\_Amount**: `number`

Số tiền thanh toán. Đã tự động tính toán theo đơn vị của VNPay. (100 lần số tiền của đơn hàng trong cơ sở dữ liệu của bạn)

#### En

Amount of payment. Automatically calculated according to the unit of VNPay. (100 times the amount of the order in your database)

### vnp\_BankCode?

> `optional` **vnp\_BankCode**: `string`

Mã Ngân hàng thanh toán

#### En

Bank code

#### Example

```ts
NCB
```

### vnp\_CreateDate?

> `optional` **vnp\_CreateDate**: `number`

Là thời gian phát sinh giao dịch định dạng yyyyMMddHHmmss(Time zone GMT+7)

Nếu `vnp_CreateDate` truyền vào không đúng định dạng, sẽ tự động lấy thời gian hiện tại

#### En

Transaction date format yyyyMMddHHmmss(Time zone GMT+7)

If `vnp_CreateDate` is not in the correct format, it will be the current time

#### Example

```ts
20170829103111
```

### vnp\_CurrCode?

> `optional` **vnp\_CurrCode**: [`GlobalConfig`](GlobalConfig.md)\[`"vnp_CurrCode"`\]

Đơn vị tiền tệ sử dụng thanh toán. Hiện tại chỉ hỗ trợ VND

#### En

Currency code using for payment. Currently only support VND

#### Example

```ts
VND
```

### vnp\_IpAddr

> **vnp\_IpAddr**: `string`

Địa chỉ IP của khách hàng thực hiện giao dịch

#### En

IP address of customer who make transaction

#### Example

```ts
13.160.92.202
```

### vnp\_Locale?

> `optional` **vnp\_Locale**: [`GlobalConfig`](GlobalConfig.md)\[`"vnp_Locale"`\]

Ngôn ngữ giao diện hiển thị. Hiện tại hỗ trợ Tiếng Việt (vn), Tiếng Anh (en)

#### En

Language display on payment gateway. Currently support Vietnamese (vn), English (en)

#### Example

```ts
vn
```

### vnp\_OrderInfo

> **vnp\_OrderInfo**: `string`

Thông tin mô tả nội dung thanh toán (Tiếng Việt, không dấu).

#### En

Description of payment (Vietnamese, no accent)

#### Example

```ts
Thanh toan don hang 12345
```

### vnp\_OrderType?

> `optional` **vnp\_OrderType**: [`GlobalConfig`](GlobalConfig.md)\[`"vnp_OrderType"`\]

Loại đơn hàng/ Mã sản phẩm

#### En

Order type/ Product Code

#### Default

```ts
'other'
@enum {ProductCode} - [ProductCode]
```

### vnp\_ReturnUrl

> **vnp\_ReturnUrl**: `string`

URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán.

#### En

URL to notify result of transaction when customer finish payment

#### Example

```ts
https://domain.vn/VnPayReturn
```

### vnp\_TxnRef

> **vnp\_TxnRef**: `string`

Mã tham chiếu của giao dịch tại hệ thống của merchant.
Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.
Không được trùng lặp trong ngày.

#### En

Reference code of transaction on merchant system. This code is unique to distinguish orders sent to VNPAY. Not duplicated in a day.

#### Example

```ts
123456
```

## Source

[types/build-payment-url.type.ts:4](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/types/build-payment-url.type.ts#L4)
