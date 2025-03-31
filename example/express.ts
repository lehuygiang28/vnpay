import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import {
    InpOrderAlreadyConfirmed,
    IpnFailChecksum,
    IpnInvalidAmount,
    IpnOrderNotFound,
    type IpnResponse,
    IpnSuccess,
    IpnUnknownError,
} from '../src/constants';
import { HashAlgorithm, ProductCode } from '../src/enums';
import type { ReturnQueryFromVNPay, VerifyReturnUrl } from '../src/types';
import { consoleLogger, ignoreLogger } from '../src/utils';
import { VNPay } from '../src/vnpay';

const app = express();
const port = 8000;

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE ?? '2QXUI4B4',
    secureSecret: process.env.VNPAY_SECURE_SECRET ?? 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: HashAlgorithm.SHA512, // optional

    /**
     * Use enableLog if you want to log
     * Disable it, then no logger will be used in any method
     */
    enableLog: true, // optional

    /**
     * Use ignoreLogger if you don't want to log console globally,
     * Then you still re-use loggerFn in each method that allow you to log
     */
    loggerFn: ignoreLogger, // optional

    /**
     * Use endpoints if you want to override the default endpoints
     * This is useful when VNPay changes the endpoints in the future
     * Or useful when production environment is different from sandbox environment
     */
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});

app.get('/', (req: Request, res: Response) => {
    return res.json({ port: port, message: 'Hello World!' });
});

/**
 * This is the get request that you will call to get the payment url to payment with VNPay
 */
app.get('/payment-url', (req: Request, res: Response) => {
    /**
     * This data is hard-coded for example, you can get it from the body or query of the request
     */
    const urlString = vnpay.buildPaymentUrl(
        {
            vnp_Amount: 10000,
            vnp_IpAddr: '1.1.1.1',
            vnp_TxnRef: '123456',
            vnp_OrderInfo: 'Payment for order 123456',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:${port}/vnpay-return`,
        },
        {
            logger: {
                type: 'pick',
                fields: ['createdAt', 'method', 'paymentUrl'], // Select fields want to log
                loggerFn: (data) => consoleLogger(data), // Log to console, or use your custom logger
            },
        },
    );
    // redirect to payment url if you use a server like MVC or SSR
    // res.redirect(urlString);

    // Or return payment url to front-end client if you use a back-end server
    return res.json({ paymentUrl: urlString });
});

/**
 * This is the get request that VNPay will call this when the payment process is done to notify the result of the payment for merchant server,
 * So you need to implement this endpoint to handle the result of the payment
 * Eg: Update the order status, send the email to the customer, etc.
 */
app.get(
    '/vnpay-ipn',
    (req: Request<unknown, unknown, unknown, ReturnQueryFromVNPay>, res: Response<IpnResponse>) => {
        try {
            const verify: VerifyReturnUrl = vnpay.verifyIpnCall(
                { ...req.query },
                {
                    logger: {
                        type: 'all', // Log all fields
                        loggerFn: consoleLogger,
                    },
                },
            );

            if (!verify.isVerified) {
                return res.json(IpnFailChecksum);
            }

            // Find the order in your database
            // This is the sample order that you need to check the status, amount, etc.
            const foundOrder = {
                orderId: '123456',
                amount: 10000,
                status: 'pending',
            };

            // If the order is not found, or the order id is not matched
            // You can use the orderId to find the order in your database
            if (!foundOrder || verify.vnp_TxnRef !== foundOrder.orderId) {
                return res.json(IpnOrderNotFound);
            }

            // If the amount is not matched
            if (verify.vnp_Amount !== foundOrder.amount) {
                return res.json(IpnInvalidAmount);
            }

            // If the order is already confirmed
            if (foundOrder.status === 'completed') {
                return res.json(InpOrderAlreadyConfirmed);
            }

            // Update the order status to completed
            // Eg: Update the order status in your database
            foundOrder.status = 'completed';

            // Then return the success response to VNPay
            return res.json(IpnSuccess);
        } catch (error) {
            console.log(`verify error: ${error}`);
            return res.json(IpnUnknownError);
        }
    },
);

/**
 * WARNING: Do not use this endpoint to handle the result of the payment, this should be used to handle redirect user from VNPay to your website
 * After the payment process is done, VNPay will redirect use page to the return url that you provided in the payment url
 */
app.get(
    '/vnpay-return',
    (req: Request<unknown, unknown, unknown, ReturnQueryFromVNPay>, res: Response) => {
        let verify: VerifyReturnUrl;
        try {
            verify = vnpay.verifyReturnUrl(
                { ...req.query },
                {
                    logger: {
                        type: 'pick',
                        fields: ['createdAt', 'method', 'isVerified', 'message'], // Select fields want to log
                        loggerFn: (data) => console.log(data), // Log to console, or use your custom logger
                    },
                },
            );
            if (!verify.isVerified) {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    console.log(`Goto http://localhost:${port}/payment-url to get the sample payment url`);
});
