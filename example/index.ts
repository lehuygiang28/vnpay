import 'dotenv/config';
import crypto from 'node:crypto';
import { ProductCode, RefundTransactionType, VnpLocale } from '../src/enums';
import type { ReturnQueryFromVNPay, VerifyReturnUrl } from '../src/types';
import { dateFormat } from '../src/utils';
import { VNPay } from '../src/vnpay';

/**
 * This function is used to generate secure hash for testing purpose only
 */
function getSampleSecureHash(queryResponseFromVNPay: ReturnQueryFromVNPay, secret: string) {
    const searchParams = new URLSearchParams();
    const sortedEntries = Object.entries(queryResponseFromVNPay).sort(([key1], [key2]) =>
        key1.toString().localeCompare(key2.toString()),
    );

    for (const [key, value] of sortedEntries) {
        // Skip empty value
        if (value === '' || value === undefined || value === null) {
            continue;
        }

        searchParams.append(key, value.toString());
    }

    return crypto
        .createHmac('sha512', secret)
        .update(Buffer.from(searchParams.toString(), 'utf-8'))
        .digest('hex');
}

async function main() {
    const secret = process.env.VNPAY_SECURE_SECRET ?? 'secret';
    const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE ?? '2QXUI4B4',
        secureSecret: secret,
        vnpayHost: 'https://sandbox.vnpayment.vn',
    });
    console.log(vnpay.defaultConfig);

    const bankList = await vnpay.getBankList();
    console.log(bankList);

    const createDate = new Date();
    const orderId = `123456-${createDate.getTime()}`;

    // Create payment url
    const urlString = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: '123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/return',
        vnp_Locale: VnpLocale.VN,
    });
    console.log(urlString);

    // Verify return url, ipn call
    const queryResponseFromVNPay: ReturnQueryFromVNPay = {
        // sample return url from vnpay
        vnp_Amount: 10000,
        vnp_BankCode: bankList[0].bank_code,
        vnp_BankTranNo: '123456',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: '123456',
        vnp_PayDate: dateFormat(new Date()),
        vnp_ResponseCode: '00',
        vnp_TmnCode: vnpay.defaultConfig.vnp_TmnCode,
        vnp_TransactionNo: '123456',
        vnp_TxnRef: orderId,
    };

    try {
        const verify: VerifyReturnUrl = vnpay.verifyReturnUrl({
            ...queryResponseFromVNPay,
            vnp_SecureHash: getSampleSecureHash(queryResponseFromVNPay, secret),
        });
        console.log(verify);
    } catch (error) {
        console.log(`verify error: ${error}`);
    }

    // Query dr
    const queryDrResult = await vnpay.queryDr({
        vnp_CreateDate: createDate.getTime(),
        vnp_IpAddr: '127.0.0.1',
        vnp_OrderInfo: 'hihihi',
        vnp_RequestId: '1212124',
        vnp_TransactionDate: createDate.getTime(),
        vnp_TransactionNo: 121212,
        vnp_TxnRef: orderId,
    });
    console.log(queryDrResult);

    // Refund request
    try {
        const refundResult = await vnpay.refund({
            vnp_Amount: 10000,
            vnp_CreateBy: 'merchant',
            vnp_IpAddr: '1.1.1.1',
            vnp_OrderInfo: '123456',
            vnp_RequestId: '123456',
            vnp_TransactionDate: 20240703213346,
            vnp_TransactionNo: 14321669,
            vnp_TransactionType: RefundTransactionType.FULL_REFUND,
            vnp_TxnRef: '123456',
            vnp_CreateDate: new Date().getTime(),
        });
        console.log(refundResult);
    } catch (error) {
        console.error(`Refund error: ${error}`);
    }
}

main();
