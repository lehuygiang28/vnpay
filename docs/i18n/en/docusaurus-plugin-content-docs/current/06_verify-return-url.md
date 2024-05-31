# Verify Return URL

When the customer successfully makes a payment, VNPay will redirect the customer to the return notification URL (`vnp_ReturnUrl`) that you have provided.

## Verify Return URL

```typescript
import { VerifyReturnUrl } from 'vnpay';

/* ... */

const verify: VerifyReturnUrl = vnpay.verifyReturnUrl(req.query);
```

## Properties of the `VerifyReturnUrl`

Information after verification and returned by VNPay

:::info
Similar to the properties of the [`VerifyIpnCall`](/ipn/verify-ipn-call#properties-of-the-verify-ipn-call)
:::

## Use in Express

### With MVC

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

    // Check order information and handle

    return res.send('Return URL verification successful');
});
```
