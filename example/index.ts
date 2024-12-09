import 'dotenv/config';
import crypto from 'crypto';
import chalk from 'chalk';
import { ProductCode, RefundTransactionType, VnpLocale } from '../src/enums';
import type { ReturnQueryFromVNPay, VerifyReturnUrl } from '../src/types';
import { buildPaymentUrlSearchParams, dateFormat } from '../src/utils';
import { VNPay } from '../src/vnpay';

/**
 * This function is used to generate secure hash for testing purpose only
 */
function getSampleSecureHash(queryResponseFromVNPay: ReturnQueryFromVNPay, secret: string) {
    const searchParams = buildPaymentUrlSearchParams(queryResponseFromVNPay);
    return crypto
        .createHmac('sha512', secret)
        .update(Buffer.from(searchParams.toString(), 'utf-8'))
        .digest('hex');
}

/**
 * Used to log data more pretty than console.log
 * @param name The name of log
 * @param data Data to be logged
 * @param isErr True if it's an error
 */
function log(name: string, data: unknown, isErr = false) {
    const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
    const logName = chalk.blue(name);

    console.log(timestamp, logName);
    if (isErr) {
        console.error(data);
    } else {
        console.log(data);
    }
    console.log(chalk.yellow('==============\n'));
}

async function main() {
    const secret = process.env.VNPAY_SECURE_SECRET ?? 'secret';
    const vnpay = new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE ?? '2QXUI4B4',
        secureSecret: secret,
        vnpayHost: 'https://sandbox.vnpayment.vn',
    });
    log('default config', vnpay.defaultConfig);

    const bankList = await vnpay.getBankList();
    log('get bank list', bankList);

    const createDate = new Date();
    const orderId = `123456-${createDate.getTime()}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create payment url
    const urlString = vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `order information of ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/return',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
    });
    log('create payment url', urlString);

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
        log('verify return url', verify);
    } catch (error) {
        log('verify error', error, true);
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
    log('query dr result', queryDrResult);

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
        log('refund result', refundResult);
    } catch (error) {
        log('refund error', error, true);
    }
}

main();
