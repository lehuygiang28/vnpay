---
sidebar_position: 5
---

# Verify IPN Call

When the payment is completed, VNPay will send an IPN (Instant Payment Notification) call to the IPN URL that you have set up. To verify the IPN call, you can use the VNPay library.

## Verify IPN

```typescript
import { VerifyIpnCall } from 'vnpay';

/* ... */

const verify: VerifyIpnCall = vnpay.verifyIpnCall(req.query);
```

## Properties of the `VerifyIpnCall`

Information after verification and returned by VNPay

| Property   | Data Type | Description                                                                                                                                            |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isSuccess  | boolean   | The result of the payment order                                                                                                                        |
| isVerified | boolean   | The result of verifying the integrity of the data received from VNPay                                                                                  |
| message    | string    | Verification message                                                                                                                                   |
| vnp_Amount | number    | The payment amount, automatically calculated by the library                                                                                            |
| ...        | ...       | Other parameters that VNPay will return, refer [here](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1) |

See more properties VNPay will return at [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91-1).
:::tip
The parameters that VNPay returns are also in the `VerifyIpnCall`.
:::

## Use in Express

Steps to verify the return URL in Express:

1. Create a route to handle the return URL
2. Verify the return URL
3. Handle the information returned from VNPay
4. Update the order status in your database
5. Update the status back to VNPay to let them know that you have confirmed the order

```typescript title="controllers/payment.controller.ts"
import {
    IpnFailChecksum,
    IpnOrderNotFound,
    IpnInvalidAmount,
    InpOrderAlreadyConfirmed,
    IpnUnknownError,
    IpnSuccess,
} from 'vnpay';

/* ... */

app.get('/vnpay-ipn', async (req, res) => {
    try {
        const verify: VerifyReturnUrl = vnpay.verifyIpnCall(req.query);
        if (!verify.isVerified) {
            return res.json(IpnFailChecksum);
        }

        // Find the order in your database
        const foundOrder = await findOrderById(verify.vnp_TxnRef); // Method to find an order by id, you need to implement it

        // If the order is not found or the order code does not match
        if (!foundOrder || verify.vnp_TxnRef !== foundOrder.orderId) {
            return res.json(IpnOrderNotFound);
        }

        // If the payment amount does not match
        if (verify.vnp_Amount !== foundOrder.amount) {
            return res.json(IpnInvalidAmount);
        }

        // If the order has been confirmed before
        if (foundOrder.status === 'completed') {
            return res.json(InpOrderAlreadyConfirmed);
        }

        /**
         * After verifying the order is complete,
         * you can update the order status in your database
         */
        foundOrder.status = 'completed';
        await updateOrder(foundOrder); // Function to update the order status, you need to implement it

        // Then update the status back to VNPay to let them know that you have confirmed the order
        return res.json(IpnSuccess);
    } catch (error) {
        /**
         * Handle exceptions
         * For example, insufficient data, invalid data, database update failure
         */
        console.log(`verify error: ${error}`);
        return res.json(IpnUnknownError);
    }
});
```
