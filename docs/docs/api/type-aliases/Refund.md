# Type alias: Refund

> **Refund**: `Pick` \<[`QueryDr`](QueryDr.md), `"vnp_RequestId"` \| `"vnp_TransactionNo"` \| `"vnp_TransactionDate"` \| `"vnp_IpAddr"`\> & `Pick` \<[`BuildPaymentUrl`](BuildPaymentUrl.md), `"vnp_Amount"` \| `"vnp_OrderInfo"` \| `"vnp_TxnRef"`\> & `object`

## Type declaration

### vnp\_CreateBy

> **vnp\_CreateBy**: `string`

Người khởi tạo hoàn tiền. Có thể là tên user thực hiện hoàn tiền của merchant.

#### En

The name of user who create the refund transaction of merchant.

### vnp\_CreateDate

> **vnp\_CreateDate**: `number`

Thời gian phát sinh yêu cầu hoàn tiền (GMT +7)

#### En

Time of refund request (GMT +7)

### vnp\_TransactionType

> **vnp\_TransactionType**: [`RefundTransactionType`](../enumerations/RefundTransactionType.md) \| `string`

Loại giao dịch tại hệ thống VNPAY:
- `02`: Giao dịch hoàn trả toàn phần
- `03`: Giao dịch hoàn trả một phần

@en:
Type of transaction at the VNPAY system:
- `02`: Full refund
- `03`: Partial refund

## Source

[types/refund.type.ts:5](https://github.com/lehuygiang28/vnpay/blob/ffb3f1a6e2e5cee6cec7ba4f806a92950f9f7872/src/types/refund.type.ts#L5)
