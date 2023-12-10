# vnpay

<div style="text-align: center;">
    <h5>
        <a href="./README.vi_vn.md">VI</a>
        |
        <a href="./README.md">EN</a>
    </h5>
</div>
<br/>

<strong>Thư viện mã nguồn mở hỗ trợ thanh toán qua [VNPay](https://vnpay.vn).</strong>

Tài liệu từ VNPay: [https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)

## Cài đặt:

Cài đặt `vnpay` với `npm`:

```bash
npm install vnpay
```

Cài đặt `vnpay` với `yarn`:

```bash
yarn add vnpay
```

Cài đặt `vnpay` với `pnpm`:

```bash
pnpm add vnpay
```

## Sử dụng:

#### Các phương thức

1. `buildPaymentUrl(payload: BuildPaymentUrlSchema): Promise<string>`: Tạo url thanh toán

2. `verifyReturnUrl(vnpayReturnQuery: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema>`: Xác thực kết quả trả về từ VNPay

3. `verifyIpnUrl(vnpayIpnQuery: ReturnQueryFromVNPaySchema): Promise<VerifyReturnUrlSchema>`: Xác thực lời gọi ipn từ VNPay

4. `queryDr(payload: QueryDrSchema): Promise<QueryDrResponseFromVNPaySchema>`: Truy vấn kết quả giao dịch

-   Import:

```typescript
// ES Modules
import { VNPay } from 'vnpay';

// CommonJS
const { VNPay } = require('vnpay');
```

-   Khởi tạo:

```typescript
// Khởi tạo VNPay
const vnpay = new VNPay({
    paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // cổng thanh toán, mặc định là sandbox
    tmnCode: 'TMNCODE', // mã tmn của bạn
    secureSecret: 'SERCRET', // secret của bạn
    returnUrl: 'http://localhost:8888/order/vnpay_return', // url trả về
});
```

-   Tạo url thanh toán:

```typescript
// Tạo url thanh toán
const urlString = await vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // giá tiền (đơn vị VND)
    vnp_IpAddr: '192.168.0.1', // địa chỉ ip của khách hàng
    vnp_TxnRef: '12345678', // mã giao dịch của bạn
    vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
});
```

-   Xác thực kết quả trả về từ VNPay:
    Lưu ý không thực hiện cập nhật trạng thái đơn hàng ở đây. Chỉ thực hiện cập nhật trạng thái đơn hàng ở lời gọi `ipn`

```typescript
/**
 * Xác thực kết quả trả về từ VNPay
 */
router.get('/order/vnpay_return', async (req, res) => {
    const verifyResult = await vnpay.verifyReturnUrl(req.query);
    if (verifyResult.isSuccess) {
        // nếu xác thực thành công, thực hiện cập nhật giao diện, v.v..
        // Lưu ý không thực hiện cập nhật trạng thái đơn hàng ở đây
        // Chỉ thực hiện cập nhật trạng thái đơn hàng ở lời gọi `ipn`
    } else {
        //nếu xác thực thất bại, thực hiện xử lý lỗi, ...
    }
});
```

-   Xác thực lời gọi ipn từ VNPay:

```typescript
/**
 * Xác thực lời gọi ipn từ VNPay
 */
router.get('/order/vnpay_ipn', async (req, res) => {
    const verifyResult = await vnpay.verifyIpnUrl(req.query);
    if (verifyResult.isSuccess) {
        // nếu xác thực thành công, thực hiện cập nhật trạng thái đơn hàng, ...
    } else {
        //nếu xác thực thất bại, thực hiện xử lý lỗi, ...
    }
});
```

-   Truy vấn kết quả thanh toán (QueryDr):

```typescript
const queryDrResult = await vnpay.queryDr({
    vnp_CreateDate: 20210809121212,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: 'hihihi',
    vnp_RequestId: '121212',
    vnp_TransactionDate: 20210809121212,
    vnp_TransactionNo: 121212,
    vnp_TxnRef: '112121',
});

console.log(queryDrResult);
```

## Contribution

<a href="https://github.com/lehuygiang28/regex-vietnamese/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/regex-vietnamese" />
</a>
