import crypto from 'crypto';
import { VNPay } from './vnpay';
import { dateFormat } from './utils';
import {
    QueryDrResponseFromVNPaySchema,
    ReturnQueryFromVNPaySchema,
    VerifyReturnUrlSchema,
} from './schemas';

async function main() {
    console.time('main');

    const secret = 'secret';
    const vnpay = new VNPay({
        tmnCode: '2QXUI4B4',
        secureSecret: secret,
        api_Host: 'https://sandbox.vnpayment.vn',
    });

    // Create payment url
    console.time('buildPaymentUrl');
    console.log('----url----------');
    const urlString = await vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: '123456',
        vnp_OrderType: 'other',
        vnp_ReturnUrl: 'http://localhost:3000/return',
    });
    console.log(urlString);
    console.timeEnd('buildPaymentUrl');

    // Verify return url, ipn call
    console.time('verifyReturnUrl');
    console.log('----verify response----------');
    const queryResponseFromVNPay: ReturnQueryFromVNPaySchema = {
        // sample return url from vnpay
        vnp_Amount: 10000,
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: '123456',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: '123456',
        vnp_PayDate: dateFormat(new Date()),
        vnp_ResponseCode: '00',
        vnp_TmnCode: '2QXUI4B4',
        vnp_TransactionNo: '123456',
        vnp_TxnRef: '123456',
    };

    try {
        const verify: VerifyReturnUrlSchema = await vnpay.verifyReturnUrl({
            ...queryResponseFromVNPay,
            vnp_SecureHash: getSampleSecureHash(queryResponseFromVNPay, secret),
        });
        console.log(verify);
    } catch (error) {
        console.log(`verify error: ${error}`);
    }
    console.timeEnd('verifyReturnUrl');

    // Query dr
    console.time('queryDr');
    console.log('----querydr----------');
    const queryDrResult: QueryDrResponseFromVNPaySchema = await vnpay.queryDr({
        vnp_CreateDate: 20210809121213,
        vnp_IpAddr: '127.0.0.1',
        vnp_OrderInfo: 'hihihi',
        vnp_RequestId: '1212123',
        vnp_TransactionDate: 20210809121212,
        vnp_TransactionNo: 121212,
        vnp_TxnRef: '112121',
    });
    console.log(queryDrResult);
    console.timeEnd('queryDr');

    console.timeEnd('main');
}

// This function is used to generate secure hash for testing purpose
function getSampleSecureHash(queryResponseFromVNPay: ReturnQueryFromVNPaySchema, secret: string) {
    const searchParams = new URLSearchParams();
    Object.entries(queryResponseFromVNPay)
        .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
        .forEach(([key, value]) => {
            // Skip empty value
            if (value === '' || value === undefined || value === null) {
                return;
            }

            searchParams.append(key, value.toString());
        });

    return crypto
        .createHmac('sha512', secret)
        .update(Buffer.from(searchParams.toString(), 'utf-8'))
        .digest('hex');
}

main();
