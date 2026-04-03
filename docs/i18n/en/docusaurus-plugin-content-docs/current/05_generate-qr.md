# Generate payment QR {#generate-qr}

`generateQr` calls VNPay with **`vnp_Command = genqr`**, using the same parameter shape as [creating a payment URL](/create-payment-url). The library signs a **GET** to the payment endpoint and parses the **JSON** body (`code`, `message`, `qrcontent`).

:::tip
Field lengths, error codes, and merchant rules live in VNPay’s **“Merchant hosted QR”** specification. Follow the copy they give you; this page focuses on using this library for that flow.

The **PDF spec** used as a reference while implementing this feature may be **attached on** [Pull Request #46](https://github.com/lehuygiang28/vnpay/pull/46) in this repository (open the PR to download or view attachments).
:::

## What the spec describes (short)

**Request (merchant → VNPay)**  

- **GET** to the payment URL (e.g. sandbox `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`) with signed query parameters including **`vnp_SecureHash`**.  
- **`vnp_Command`**: `genqr` (set by the library).  
- Other fields (`vnp_TmnCode`, `vnp_TxnRef`, `vnp_Amount`, …) must follow VNPay. **`vnp_Amount`** must be **amount × 100** on the wire; this package still takes the **human amount** like `buildPaymentUrl` and multiplies by 100 internally.

**Response (VNPay → merchant)**  

- **`Content-Type: application/json`**.  
- **`code`**: `00` means QR generation succeeded; anything else is an error (see VNPay’s error table).  
- **`message`**: description.  
- **`qrcontent`**: payload for a QR image or deep link; **when `code` is not `00`**, the spec says **`qrcontent` is an empty string**.

For non-`00` responses, the library may **normalize `message`** using `vnp_Locale` (from the request or your `VNPay` defaults) for readability; **`code` stays VNPay’s**.

:::info
**Where it runs**

- On the **server** (needs `secureSecret`).  
- A runtime with **`fetch`** (Node 18+ is usually enough).
:::

## Quick example

The QR spec usually requires **`vnp_CreateDate`** and **`vnp_ExpireDate`** (GMT+7, `yyyyMMddHHmmss`, proper ordering and validity window). Example using this package’s `dateFormat`:

```typescript
import { ProductCode, VnpLocale, dateFormat } from 'vnpay';

const start = new Date();
const end = new Date(start.getTime() + 15 * 60 * 1000); // e.g. 15 minutes later

const result = await vnpay.generateQr({
    vnp_Amount: 10000,
    vnp_IpAddr: '192.168.1.1',
    vnp_TxnRef: 'ORD-123456',
    vnp_OrderInfo: 'Payment for order ORD-123456',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'https://merchant.example.com/return',
    vnp_Locale: VnpLocale.EN,
    vnp_CreateDate: dateFormat(start),
    vnp_ExpireDate: dateFormat(end),
});

if (result.code === '00' && result.qrcontent) {
    // Render QR or open deep link from result.qrcontent
} else {
    // qrcontent is typically empty on failure
}
```

More fields: [`BuildPaymentUrl` table](/create-payment-url#build-payment-url).

## API

```ts
generateQr(
  data: BuildPaymentUrl,
  options?: GenerateQrResponseOptions
): Promise<GenerateQrResponse>
```

### `GenerateQrResponse` (VNPay JSON)

| Field        | Meaning (per spec)                          |
| ------------ | --------------------------------------------- |
| `code`       | `00`: success; payload in `qrcontent`         |
| `message`    | Description / error text                      |
| `qrcontent`  | QR payload; **empty** when not successful     |

### `GenerateQrResponseOptions`

Same as elsewhere: [LoggerOptions](/create-payment-url#logger-options).

:::note
Logs record **`qrcontentLength`**, not the full `qrcontent`.
:::

## When something fails

- Bad HTTP, network issues, or malformed payloads surface as rejected promises.  
- For **`code` values and raw messages**, use the Merchant hosted QR spec and VNPay’s error reference.

See also: [VNPay PAY documentation](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html).
