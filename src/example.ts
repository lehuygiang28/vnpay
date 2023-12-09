import { VNPay } from './vnpay';

async function main() {
    const vnpay = new VNPay({
        tmnCode: '2QXUI4B4',
        secureSecret: 'secret',
        returnUrl: 'https://sandbox.vnpayment.vn/tryitnow/Home/ReturnResult',
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
        vnp_PayDate: 20220101120000,
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
}

main();
