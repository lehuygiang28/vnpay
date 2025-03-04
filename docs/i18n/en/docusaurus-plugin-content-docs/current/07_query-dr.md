# Query Transaction Result (queryDr) {#query-dr}

This is an API for the merchant system to query the payment result of a transaction in the VNPAY system.

:::warning

-   `queryDr` is currently suitable for `PAY` payments
-   `token`, `installment`, and `periodic` payment types are not yet compatible

:::

## QueryDR

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * The date must be in GMT+7 timezone
 * And formatted as `yyyyMMddHHmmss`
 * Use the `getDateInGMT7` and `dateFormat` functions to convert
 */
const date = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const res: QueryDrResponse = await vnpay.queryDr({
    vnp_RequestId: generateRandomString(16),
    vnp_IpAddr: '1.1.1.1',
    vnp_TxnRef: '1716257871703',
    vnp_TransactionNo: 14422574,
    vnp_OrderInfo: 'Payment for order',
    vnp_TransactionDate: date,
    vnp_CreateDate: date,
} as QueryDr);
```

## Properties

### `QueryDr` {#query-dr-properties}

| Property              | Type     | Description                                                                             |
| --------------------- | -------- | --------------------------------------------------------------------------------------- |
| `vnp_RequestId`       | `string` | Request ID for transaction result query. This ID must be unique for each query request. |
| `vnp_IpAddr`          | `string` | IP address of the client.                                                               |
| `vnp_TxnRef`          | `string` | Transaction code of the merchant system.                                                |
| `vnp_TransactionNo`   | `number` | Transaction code of the VNPAY system.                                                   |
| `vnp_OrderInfo`       | `string` | Order information.                                                                      |
| `vnp_TransactionDate` | `number` | Transaction time.                                                                       |
| `vnp_CreateDate`      | `number` | Transaction creation time.                                                              |

### `QueryDrResponse` {#query-dr-response-properties}

| Property   | Type    | Description                                                                                                                                                                   |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isSuccess  | boolean | Result of the request                                                                                                                                                         |
| isVerified | boolean | Verification result of data integrity when received from VNPay                                                                                                                |
| message    | string  | Verification message                                                                                                                                                          |
| ...        | ...     | Other parameters that VNPay will return, refer to [official documentation](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response) |

See more properties that VNPay will return in the [official documentation](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#danh-sach-tham-so-querydr-VNPAY-response).
:::tip
All parameters returned by VNPay are also included in the `QueryDrResponse` object.
:::

## Usage

### With Logger

-   To use the logger, you need to initialize [`VNPay`](/installation#init-vnpay) with `enableLog` set to `true`.

```typescript
import { QueryDr, QueryDrResponse, getDateInGMT7, dateFormat } from 'vnpay';

/* ... */

/**
 * The date must be in GMT+7 timezone
 * And formatted as `yyyyMMddHHmmss`
 * Use the `getDateInGMT7` and `dateFormat` functions to convert
 */
const date = dateFormat(getDateInGMT7(new Date('2024/05/21')));

const res: QueryDrResponse = await vnpay.queryDr(
    {
        vnp_RequestId: generateRandomString(16),
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '1716257871703',
        vnp_TransactionNo: 14422574,
        vnp_OrderInfo: 'Payment for order',
        vnp_TransactionDate: date,
        vnp_CreateDate: date,
    } as QueryDr,
    {
        logger: {
            type: 'all',
            loggerFn: (data) => {
                console.log(data.message);
                // Or send logs to a server, database, etc.
            },
        },
    },
);
```
