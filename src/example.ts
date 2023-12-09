import { VNPay } from './vnpay';
import { dateFormat } from './utils';

async function main() {
    const vnpay = new VNPay({
        tmnCode: '2QXUI4B4',
        secureSecret: 'secret',
        api_Host: 'https://sandbox.vnpayment.vn',
    });

    const urlString = await vnpay.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: '123456',
        vnp_OrderType: 'other',
    });
    console.log(urlString);

    // Will show the error wrong checksum because the vnp_SecureHash is wrong, need to call to vnpay to get the correct vnp_SecureHash
    const verify = await vnpay.verifyReturnUrl({
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
        vnp_SecureHash: 'vnp_SecureHash',
    });
    console.log(verify);
    console.warn(
        'Will show the error wrong checksum because the vnp_SecureHash is wrong, need to call to vnpay to get the correct vnp_SecureHash',
    );

    console.log('----querydr----------');
    const res = await vnpay.queryDr({
        vnp_CreateDate: 20210809121212,
        vnp_IpAddr: '127.0.0.1',
        vnp_OrderInfo: 'hihihi',
        vnp_RequestId: '121212',
        vnp_TransactionDate: 20210809121212,
        vnp_TransactionNo: 121212,
        vnp_TxnRef: '112121',
    });

    console.log(res.data);
}

main();
