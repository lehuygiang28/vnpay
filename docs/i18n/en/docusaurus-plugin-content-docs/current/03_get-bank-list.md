# Bank List {#get-bank-list}

:::info
This bank list is used for the `vnp_BankCode` parameter
:::

## Get Bank List

```typescript
import { Bank } from 'vnpay';

/* ... */

const bankList: Bank[] = await vnpay.getBankList();
```

## Properties of the `Bank` Object

| Property        | Type     | Description        |
| --------------- | -------- | ------------------ |
| `bank_code`     | `string` | Bank code          |
| `bank_name`     | `string` | Bank name          |
| `logo_link`     | `string` | Bank logo URL      |
| `bank_type`     | `number` | Bank type          |
| `display_order` | `number` | Display order      |

:::info
See more details in the [official VNPay documentation](https://sandbox.vnpayment.vn/apis/docs/chuyen-doi-thuat-toan/changeTypeHash.html#tao-url-thanh-toan)
:::
