import { VNPay } from '..';

async function main() {
    const ins = new VNPay({
        tmnCode: '2QXUI4B4',
        secureSecret: 'hihi',
        returnUrl: 'https://sandbox.vnpayment.vn/tryitnow/Home/ReturnResult',
    });

    const url = await ins.buildPaymentUrl({
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: '123456',
    });
    console.log(url);

    const query: any = {
        vnp_Amount: '10000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: '123456',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: '123456',
        vnp_PayDate: '20220101120000',
        vnp_ResponseCode: '00',
        vnp_TmnCode: '2QXUI4B4',
        vnp_TransactionNo: '123456',
        vnp_TxnRef: '123456',
        vnp_SecureHash: 'hash',
    };
    const verify = await ins.verifyReturnUrl(query);
    console.log(verify);
}

main();
