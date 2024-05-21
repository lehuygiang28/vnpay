# Type alias: QueryDr

> **QueryDr**: `Pick` \<[`BuildPaymentUrl`](BuildPaymentUrl.md), `"vnp_TxnRef"` \| `"vnp_OrderInfo"` \| `"vnp_CreateDate"`\> & `Pick` \<[`ReturnQueryFromVNPay`](ReturnQueryFromVNPay.md), `"vnp_TxnRef"`\> & `object`

## Type declaration

### vnp\_IpAddr

> **vnp\_IpAddr**: `string`

Địa chỉ IP của máy chủ thực hiện gọi API

#### En

IP address of the server that calls the API

### vnp\_RequestId

> **vnp\_RequestId**: `string`

Mã hệ thống merchant tự sinh ứng với mỗi yêu cầu truy vấn giao dịch.
Mã này là duy nhất dùng để phân biệt các yêu cầu truy vấn giao dịch. Không được trùng lặp trong ngày.

#### En

Merchant system code automatically generated for each transaction query request.
This code is unique to distinguish transaction query requests. Not duplicated in a day.

### vnp\_TransactionDate

> **vnp\_TransactionDate**: `number`

Thời gian ghi nhận giao dịch tại hệ thống của merchant tính theo GMT+7, định dạng: yyyyMMddHHmmss, tham khảo giá trị:
- Thanh toán PAY giống vnp_CreateDate của vnp_Command=pay
- Thanh toán bằng mã Token giống "vnp_create_date" của "vnp_Command=pay_and_create" và "vnp_command=token_pay"

#### En

Transaction time recorded at merchant system according to GMT + 7, format: yyyyMMddHHmmss, refer to value:
- PAY payment same as vnp_CreateDate of vnp_Command = pay
- Payment by Token code same as "vnp_create_date" of "vnp_Command = pay_and_create" and "vnp_command = token_pay"

### vnp\_TransactionNo

> **vnp\_TransactionNo**: `number`

Mã giao dịch ghi nhận tại hệ thống VNPAY.

#### En

Transaction code recorded in VNPAY system.

#### Example

```ts
20170829153052
```

## Source

[types/query-dr.type.ts:5](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/types/query-dr.type.ts#L5)
