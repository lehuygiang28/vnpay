import express, { Request, Response } from 'express';
import portfinder from 'portfinder';
import { VNPay } from '../src/vnpay';
import { ReturnQueryFromVNPaySchema, VerifyReturnUrlSchema } from '../src/schemas';

const app = express();
let portToListen = 3000;

const vnpay = new VNPay({
    tmnCode: '2QXUI4B4',
    secureSecret: 'secret',
    api_Host: 'https://sandbox.vnpayment.vn',
});

app.get('/', (req: Request, res: Response) => {
    return res.json({ port: portToListen, message: 'Hello World!' });
});

/**
 * This is the get request that you will call to get the payment url to payment with VNPay
 */
app.get('/payment-url', async (req: Request, res: Response) => {
    /**
     * This data is hard-coded for example, you can get it from the body or query of the request
     */
    const urlString = await vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: '123456',
        vnp_OrderType: 'other',
        vnp_ReturnUrl: `http://localhost:${portToListen}/return`,
    });
    // Or redirect to payment url if you use a server like MVC or SSR
    // res.redirect(urlString);

    // Return payment url to front-end client if you use a back-end server
    return res.json({ paymentUrl: urlString });
});

/**
 * This is the get request that VNPay will call this when the payment process is done to notify the result of the payment for merchant server,
 * So you need to implement this endpoint to handle the result of the payment
 * Eg: Update the order status, send the email to the customer, etc.
 */
app.get(
    '/vnpay-ipn',
    async (req: Request<any, any, any, ReturnQueryFromVNPaySchema>, res: Response) => {
        let verify: VerifyReturnUrlSchema;
        try {
            verify = await vnpay.verifyReturnUrl({ ...req.query });
            if (!verify.isSuccess) {
                return res.status(200).json({
                    message: verify?.message ?? 'Payment failed!',
                    status: verify.isSuccess,
                });
            }
        } catch (error) {
            console.log(`verify error: ${error}`);
            return res.status(400).json({ message: 'verify error', status: false });
        }

        // Update the order status, send the email to the customer, etc.

        return res.status(200).json({
            message: verify?.message ?? 'Payment successful!',
            status: verify.isSuccess,
        });
    },
);

/**
 * WARNING: Do not use this endpoint to handle the result of the payment, this should be used to handle redirect user from VNPay to your website
 * After the payment process is done, VNPay will redirect use page to the return url that you provided in the payment url
 */
app.get(
    '/vnpay-return',
    async (req: Request<any, any, any, ReturnQueryFromVNPaySchema>, res: Response) => {
        let verify: VerifyReturnUrlSchema;
        try {
            verify = await vnpay.verifyReturnUrl({ ...req.query });
            if (!verify.isSuccess) {
                return res.status(200).json({
                    message: verify?.message ?? 'Payment failed!',
                    status: verify.isSuccess,
                });
            }
        } catch (error) {
            console.log(`verify error: ${error}`);
            return res.status(400).json({ message: 'verify error', status: false });
        }

        return res.status(200).json({
            message: verify?.message ?? 'Payment successful!',
            status: verify.isSuccess,
        });
    },
);

// Use portfinder to find an open port to listen on
portfinder.getPort({ port: portToListen }, (err, port) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}!`);
            portToListen = port;
        });
    }
});
