# Danh sách ngân hàng {#get-bank-list}

:::info
Danh sách này được sử dụng cho tham số `vnp_BankCode` khi tạo URL thanh toán
:::

## Lấy danh sách ngân hàng

```typescript
import { Bank } from 'vnpay';

/* ... */

const bankList: Bank[] = await vnpay.getBankList();
```

## Các thuộc tính của đối tượng `Bank`

| Thuộc tính     | Kiểu dữ liệu | Mô tả                  |
| -------------- | ------------ | ---------------------- |
| `bank_code`    | `string`     | Mã ngân hàng           |
| `bank_name`    | `string`     | Tên ngân hàng          |
| `logo_link`    | `string`     | URL logo ngân hàng     |
| `bank_type`    | `number`     | Loại ngân hàng         |
| `display_order`| `number`     | Thứ tự hiển thị        |

:::info
Xem thêm chi tiết tại [tài liệu chính thức của VNPay](https://sandbox.vnpayment.vn/apis/docs/chuyen-doi-thuat-toan/changeTypeHash.html#tao-url-thanh-toan)
:::
