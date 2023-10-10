import { VNPay } from './vnpay';

async function main() {
    const vn = await VNPay.setup({
        paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        tmnCode: 'K8C1PIGA',
        secureSecret: 'NKBPWTVCDMNYDTTCFGWGOEFMYWDJRVEN',
    });

    const tnx = '33213213213';
    console.log(
        await vn.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '118.68.139.5',
            vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
            vnp_TxnRef: tnx,
            vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
        }),
    );
}

main();
