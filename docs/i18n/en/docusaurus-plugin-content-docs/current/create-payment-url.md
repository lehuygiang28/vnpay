---
sidebar_position: 3
---

# Create Payment URL

Create a payment URL for VNPay.

## Create Payment URL

```typescript
import { ProductCode, VnpLocale } from 'vnpay';

/* ... */

const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: '13.160.92.202',
    vnp_TxnRef: '12345',
    vnp_OrderInfo: 'Payment for order 12345',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
    vnp_Locale: VnpLocale.VN, // 'vn' or 'en'
});
```

## Properties

| Property      | Description                                       | Note                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vnp_Amount    | Payment amount                                    | In VND. The amount has been automatically calculated, no need to multiply by 100 as per VNPay                                                                                                                  |
| vnp_IpAddr    | IP address of the customer making the transaction | Example: 13.160.92.202                                                                                                                                                                                         |
| 202           |
| vnp_TxnRef    | Customer's order code                             | This code is unique and used to distinguish orders sent to VNPAY. It should not be duplicated within a day. Example: 23554                                                                                     |
| vnp_OrderInfo | Order information                                 | Data regulations sent to VNPAY (Vietnamese without accents and does not include special characters). Example: Top up for subscriber 0123456789. Amount 100,000 VND                                             |
| vnp_OrderType | Order type                                        | Each product will belong to a category group as regulated by VNPAY. Use the available enum from ProductCode or see more in the [Product Category](https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/) table |
| vnp_ReturnUrl | Return path after payment                         | This is the URL to which VNPay will redirect the user after the payment is completed. For example: https://domain.vn/VnPayReturn                                                                               |
| vnp_Locale    | Language displayed on the payment gateway         | Currently supports Vietnamese (vn), English (en)                                                                                                                                                               |

See more properties at [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91).

## Use in Express

### With MVC

Steps to create a payment URL in Express with MVC:

1. Create a route to handle orders
2. After creating the order, proceed to create the payment URL
3. Redirect the customer to the payment URL
4. After payment, VNPay will redirect the customer to `vnp_ReturnUrl`

```typescript title="controllers/order.controller.ts"
// Route to handle orders
app.post('/order', async (req, res) => {
    // Create order
    const order = await createOrder(req.body); // Order creation function, you need to implement it yourself

    // Create payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: order.orderId,
        vnp_OrderInfo: `Payment for order ${order.orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
        vnp_Locale: VnpLocale.VN,
    });

    return res.redirect(paymentUrl);
});
```

### With API

Steps to create a payment URL in Express with API:

1. Backend creates an API to handle orders
2. Frontend calls API to create order
3. After creating the order, proceed to create the payment URL
4. Return the payment URL and/or order information to Frontend
5. Frontend redirects the customer to the payment URL
6. After payment, VNPay will redirect the customer to `vnp_ReturnUrl`

```typescript title="server.ts"
// API to handle orders
app.post('/api/order', async (req, res) => {
    // Create order
    const order = await createOrder(req.body); // Order creation function, you need to implement it yourself

    // Get returnUrl from frontend, if not use default
    const returnUrl = req.body?.returnUrl || 'http://localhost:3000/vnpay-return';

    // Create payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: order.orderId,
        vnp_OrderInfo: `Payment for order ${order.orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl, // The path should be of the frontend
        vnp_Locale: VnpLocale.VN,
    });

    return res.json({ paymentUrl, order });
});
```
