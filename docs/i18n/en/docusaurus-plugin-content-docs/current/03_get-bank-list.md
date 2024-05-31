# Bank List {#get-bank-list}

:::info
Bank list, used for `vnp_BankCode`
:::

## Get Bank List

```typescript
import { Bank } from 'vnpay';

/* ... */

const bankList: Bank[] = await vnpay.getBankList();
```

## Properties of `Bank` Object

| Property        | Type     | Description    |
| --------------- | -------- | -------------- |
| `bank_code`     | `string` | Bank code      |
| `bank_name`     | `string` | Bank name      |
| `logo_link`     | `string` | Bank logo link |
| `bank_type`     | `number` | Bank type      |
| `display_order` | `number` | Display order  |

:::info
See more [here](https://sandbox.vnpayment.vn/apis/docs/chuyen-doi-thuat-toan/changeTypeHash.html#tao-url-thanh-toan)
:::
