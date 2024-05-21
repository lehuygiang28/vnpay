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

[types/verify-return-url.type.ts:4](https://github.com/lehuygiang28/vnpay/blob/ffb3f1a6e2e5cee6cec7ba4f806a92950f9f7872/src/types/verify-return-url.type.ts#L4)
