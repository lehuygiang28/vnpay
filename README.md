# vnpay

<div style="text-align: center;">
    <h5>
        <a href="./README.en-US.md">EN</a>
        |
        <a href="./README.md">VI</a>
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

| Method            | Parameters                                     | Return Type                               | Description                      |
| ----------------- | ---------------------------------------------- | ----------------------------------------- | -------------------------------- |
| `buildPaymentUrl` | `payload: BuildPaymentUrlSchema`               | `Promise<string>`                         | Tạo url thanh toán               |
| `verifyReturnUrl` | `vnpayReturnQuery: ReturnQueryFromVNPaySchema` | `Promise<VerifyReturnUrlSchema>`          | Xác thực kết quả trả về từ VNPay |
| `verifyIpnUrl`    | `vnpayIpnQuery: ReturnQueryFromVNPaySchema`    | `Promise<VerifyReturnUrlSchema>`          | Xác thực lời gọi ipn từ VNPay    |
| `queryDr`         | `payload: QueryDrSchema`                       | `Promise<QueryDrResponseFromVNPaySchema>` | Truy vấn kết quả giao dịch       |

-   Nhập thư viện:

```typescript
// ES Modules
import { VNPay } from 'vnpay';

// CommonJS
const { VNPay } = require('vnpay');
```

-   Khởi tạo đối tượng VNPay:

```typescript
// Khởi tạo VNPay
const vnpay = new VNPay({
    api_Host: 'https://sandbox.vnpayment.vn', // cổng thanh toán, mặc định là sandbox
    tmnCode: 'TMNCODE', // mã tmn của bạn (mã đăng ký với VNPay)
    secureSecret: 'SERCRET', // secret của bạn (mã đăng ký với VNPay)
});
// Kiểm tra email của bạn để lấy mã tmn và secret
```

-   Tạo url thanh toán:

```typescript
// Tạo url thanh toán
const urlString = await vnpay.buildPaymentUrl({
    vnp_Amount: 100000, // giá tiền (đơn vị VND)
    vnp_IpAddr: '192.168.0.1', // địa chỉ ip của khách hàng
    vnp_TxnRef: '12345678', // mã giao dịch của bạn
    vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
    returnUrl: 'http://localhost:8888/order/vnpay_return', // return url
});
```

-   Xác thực lời gọi thông báo thanh toán ngay lập tức (ipn - instant payment notification) từ VNPay:

```typescript
/**
 * Xác thực lời gọi ipn từ VNPay
 * Lưu ý: Thực hiện cập nhật trạng thái đơn hàng, v.v..
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

-   Xác thực kết quả trả về từ VNPay:

    _**Lưu ý:** Không thực hiện cập nhật trạng thái đơn hàng ở đây. Chỉ thực hiện cập nhật trạng thái đơn hàng ở lời gọi `ipn - instant payment notification`_

```typescript
/**
 * Xác thực kết quả trả về từ VNPay
 * Lưu ý: Không thực hiện cập nhật trạng thái đơn hàng ở đây
 * Nên sử dụng để chuyển hướng người dùng về trang web của bạn,...
 */
router.get('/order/vnpay_return', async (req, res) => {
    const verifyResult = await vnpay.verifyReturnUrl(req.query);
    if (verifyResult.isSuccess) {
        // Nếu xác thực thành công, thực hiện cập nhật giao diện, v.v..
        // Lưu ý không thực hiện cập nhật trạng thái đơn hàng ở đây
        // Chỉ thực hiện cập nhật trạng thái đơn hàng ở lời gọi `ipn`
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
    vnp_OrderInfo: 'Don hang 12345',
    vnp_RequestId: '121212',
    vnp_TransactionDate: 20210809121212,
    vnp_TransactionNo: 121212,
    vnp_TxnRef: '112121',
});

console.log(queryDrResult);
```

#### Code tham khảo: [Bấm vào đây](https://github.com/lehuygiang28/vnpay/blob/main/src/example.ts)

## Contribution

<a href="https://github.com/lehuygiang28/regex-vietnamese/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lehuygiang28/vnpay" />
</a>
