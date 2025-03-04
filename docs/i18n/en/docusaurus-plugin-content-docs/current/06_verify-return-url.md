# Verify Return URL

When a customer successfully completes a payment, VNPay will redirect the customer to the return notification URL (`vnp_ReturnUrl`) that you provided.

## Verify Return URL

```typescript
import { VerifyReturnUrl } from 'vnpay';

/* ... */

const verify: VerifyReturnUrl = vnpay.verifyReturnUrl(req.query);
```

## Properties of the `VerifyReturnUrl` Object

Information after verification and returned by VNPay:

:::info
Similar to the properties of the [`VerifyIpnCall`](/ipn/verify-ipn-call#properties-of-the-verify-ipn-call) object
:::

## Usage

### Using Logger

- Similar to when creating a payment URL, you can use a logger to log return URL verification information
  [see here](/create-payment-url#using-logger).

### With Express MVC

Steps to verify the return URL in Express with MVC:

1. Create a route to handle the return URL
2. Verify the return URL
3. Handle the information returned from VNPay

```typescript title="controllers/payment.controller.ts"
// Route to handle return URL
// Instead of sending text, you can render a template or redirect the customer to the necessary page
app.get('/vnpay-return', (req, res) => {
    let verify: VerifyReturnUrl;
    try {
        // Use try-catch to catch errors if the query is invalid or lacks data
        verify = vnpay.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return res.send('Data integrity verification failed');
        }
        if (!verify.isSuccess) {
            return res.send('Payment order failed');
        }
    } catch (error) {
        return res.send('Invalid data');
    }

    // Check order information and handle accordingly
    // Only handle UI-related here, do not handle business logic
    // Important business logic must be handled on the server side via IPN

    return res.send('Return URL verification successful');
});
```
