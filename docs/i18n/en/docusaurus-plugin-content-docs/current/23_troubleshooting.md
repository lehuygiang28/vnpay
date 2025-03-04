# Troubleshooting

This section covers common issues and their solutions when integrating and using the VNPay library.

## Common Issues

### Invalid Checksum Errors

**Problem**: You're receiving `invalid checksum` errors when verifying VNPay responses.

**Solutions**:
- Check that you're using the correct `secureSecret` value.
- Ensure you're using the same hash algorithm as configured in the VNPay portal.
- Verify that you haven't modified any parameters received from VNPay before verification.

### Payment Failures

**Problem**: Payments are failing with error codes.

**Solutions**:
- Check the error code in the [VNPay documentation](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html).
- Verify your `vnp_Amount` is formatted correctly (the library automatically multiplies by 100).
- Ensure your `vnp_ExpireDate` is set to a future time.
- Check that your `vnp_TxnRef` is unique for the given day.

### IPN Not Being Received

**Problem**: You're not receiving IPN notifications after payments.

**Solutions**:
- Verify your IPN URL is correctly configured in the VNPay portal.
- Ensure your server is publicly accessible and can receive POST requests.
- Check server firewall settings to allow incoming requests from VNPay IP addresses.
- In development, use a service like [ngrok](https://ngrok.com/) to expose your local server.

### Return URL Errors

**Problem**: Users are not being redirected properly after payment.

**Solutions**:
- Ensure your `vnp_ReturnUrl` is publicly accessible.
- Check that the URL is correctly encoded in the payment URL.
- Verify the route handler is correctly implemented.

### Incorrect Amount Calculations

**Problem**: The amount is not being processed correctly.

**Solutions**:
- Remember that the library automatically multiplies your amount by 100 before sending to VNPay.
- Don't multiply the amount yourself; provide the actual amount in VND.

### Sandbox vs. Production Issues

**Problem**: Code works in sandbox but fails in production.

**Solutions**:
- Ensure you've updated all configuration values for production.
- Verify your production credentials with VNPay.
- Check that your server IP address is properly whitelisted in VNPay's production environment.

## Debugging Tips

1. **Enable Logging**: Use the library's built-in logging features to capture detailed information about requests and responses.

```typescript
const vnpay = new VNPay({
    // ... other config
    enableLog: true,
    loggerFn: (data) => {
        console.log(JSON.stringify(data, null, 2));
        // Or save to a file/database
    }
});
```

2. **Check Network Requests**: Use browser developer tools or server-side monitoring to examine the raw requests and responses.

3. **Validate Input Data**: Double-check all input parameters before sending them to VNPay.

4. **Test with VNPay's Test Cards**: Use the [test card numbers](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#th%E1%BA%BB-test) provided by VNPay for sandbox testing.

## Getting Help

If you continue to experience issues after trying these troubleshooting steps, you can:

1. Open an [issue on GitHub](https://github.com/lehuygiang28/vnpay/issues)
2. Check existing [discussions](https://github.com/lehuygiang28/vnpay/discussions)
3. Contact VNPay support directly for account-specific or API issues 