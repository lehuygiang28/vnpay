# Type alias: VerifyReturnUrl

> **VerifyReturnUrl**: `object` & [`ReturnQueryFromVNPay`](ReturnQueryFromVNPay.md)

## Type declaration

### isSuccess

> **isSuccess**: `boolean`

Trạng thái giao dịch

#### En

Transaction status

#### Example

```ts
true
```

### isVerified

> **isVerified**: `boolean`

Trạng thái xác nhận tính đúng đắn, toàn vẹn khi nhận dữ liệu từ VNPay

#### En

Verification status, true when data from VNPay is correct and verified

#### Example

```ts
true
```

### message

> **message**: `string`

Thông báo lỗi

#### En

Error message

#### Example

```ts
'Giao dịch thành công'
```

## Source

[types/verify-return-url.type.ts:4](https://github.com/lehuygiang28/vnpay/blob/e8e94e8a800b1952e47648e8b76237a738bccbb7/src/types/verify-return-url.type.ts#L4)
