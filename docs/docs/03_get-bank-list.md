# Danh sách ngân hàng {#get-bank-list}

:::info
Danh sách ngân hàng, sử dụng cho `vnp_BankCode`
:::

## Lấy danh sách ngân hàng

```typescript
import { Bank } from 'vnpay';

/* ... */

const bankList: Bank[] = await vnpay.getBankList();
```

## Các thuộc tính của đối tượng `Bank`

| Thuộc tính      | Kiểu dữ liệu | Mô tả                        |
| --------------- | ------------ | ---------------------------- |
| `bank_code`     | `string`     | Mã ngân hàng                 |
| `bank_name`     | `string`     | Tên ngân hàng                |
| `logo_link`     | `string`     | Đường dẫn logo của ngân hàng |
| `bank_type`     | `number`     | Loại ngân hàng               |
| `display_order` | `number`     | Thứ tự hiển thị              |

:::info
Xem thêm [tại đây](https://sandbox.vnpayment.vn/apis/docs/chuyen-doi-thuat-toan/changeTypeHash.html#tao-url-thanh-toan)
:::
