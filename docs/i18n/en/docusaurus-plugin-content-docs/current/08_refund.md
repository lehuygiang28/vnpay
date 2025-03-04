# Refund Transaction (refund) {#refund}

This is an API for the merchant system to send a refund request for a transaction through the VNPAY Payment Gateway.

:::warning Note:

-   `refund` is one of the functions restricted by VNPAY in the sandbox environment. You need to contact VNPAY for support.
-   See more at [issue#12](https://github.com/lehuygiang28/vnpay/issues/12)

:::

## Refund

```typescript
import { Refund, RefundResponse, dateFormat, getDateInGMT7, VnpTransactionType, VnpLocale } from 'vnpay';

/* ... */

/**
 * The date must be in GMT+7 timezone
 * And formatted as `yyyyMMddHHmmss`
 * Use the `getDateInGMT7` and `dateFormat` functions to convert
 */
const refundRequestDate = dateFormat(getDateInGMT7(new Date('2024/05/26')));
const orderCreatedAt = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const result: RefundResponse = await vnpay.refund({
    vnp_Amount: 10000,
    vnp_CreateBy: 'giang',
    vnp_CreateDate: refundRequestDate,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'Test order',
    vnp_RequestId: '123456',
    vnp_TransactionDate: orderCreatedAt,
    vnp_TransactionType: VnpTransactionType.FULL_REFUND,
    vnp_TxnRef: '123456',
    vnp_Locale: VnpLocale.EN,
    // vnp_TransactionNo: 123456, // optional
} as Refund);
```

## Properties

### `Refund` {#Refund-properties}

| Property              | Type                 | Description                                                                                                                                                        |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vnp_Amount`          | `number`             | The amount to be refunded to the customer. This amount is less than or equal to the transaction amount.                                                            |
| `vnp_CreateBy`        | `string`             | The person initiating the refund. It could be the username of the merchant who performs the refund.                                                                |
| `vnp_CreateDate`      | `number`             | The time the refund request is made (Request Date) GMT+7.                                                                                                          |
| `vnp_IpAddr`          | `string`             | IP address of the server executing the API call.                                                                                                                   |
| `vnp_OrderInfo`       | `string`             | Description of the refund request (Request description).                                                                                                           |
| `vnp_RequestId`       | `string`             | The merchant's system-generated code for each refund request. This code is unique and used to distinguish refund requests. It must not be duplicated within a day. |
| `vnp_TransactionDate` | `number`             | The time the transaction is recorded on the merchant's website, calculated in GMT+7.                                                                               |
| `vnp_TransactionNo`   | `number`             | The transaction code recorded in the VNPAY system.                                                                                                                 |
| `vnp_TransactionType` | `VnpTransactionType` | The type of transaction in the VNPAY system.                                                                                                                       |
| `vnp_TxnRef`          | `string`             | The payment transaction code of the merchant's system sent to VNPAY for payment request.                                                                           |
| `vnp_Locale`          | `VnpLocale`          | The language displayed in the response. Currently supports Vietnamese (vn), English (en).                                                                          |

### `RefundResponse` {#refund-response-properties}

| Property   | Type    | Description                                                                                                                                                                 |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess  | boolean | The result of the request.                                                                                                                                                  |
| isVerified | boolean | The result of data integrity verification when received from VNPay.                                                                                                         |
| message    | string  | Verification message.                                                                                                                                                       |
| ...        | ...     | Other parameters that VNPay will return, refer to [official documentation](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund). |

See more properties that VNPay will return in the [official documentation](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-s%C3%A1ch-tham-s%E1%BB%91-refund).
:::tip
All parameters returned by VNPay are also included in the `RefundResponse` object.
:::
