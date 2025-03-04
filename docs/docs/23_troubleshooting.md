# Xử Lý Sự Cố

Phần này đề cập đến các vấn đề phổ biến và giải pháp của chúng khi tích hợp và sử dụng thư viện VNPay.

## Các Vấn Đề Phổ Biến

### Lỗi Checksum Không Hợp Lệ

**Vấn đề**: Bạn đang nhận được lỗi `invalid checksum` khi xác minh phản hồi từ VNPay.

**Giải pháp**:
- Kiểm tra xem bạn đang sử dụng giá trị `secureSecret` chính xác.
- Đảm bảo bạn đang sử dụng cùng thuật toán hash đã được cấu hình trong cổng thông tin VNPay.
- Xác minh rằng bạn không thay đổi bất kỳ tham số nào nhận được từ VNPay trước khi xác minh.

### Thanh Toán Thất Bại

**Vấn đề**: Các thanh toán đang thất bại với mã lỗi.

**Giải pháp**:
- Kiểm tra mã lỗi trong [tài liệu VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html).
- Xác minh `vnp_Amount` của bạn được định dạng chính xác (thư viện tự động nhân với 100).
- Đảm bảo `vnp_ExpireDate` của bạn được đặt thành thời gian trong tương lai.
- Kiểm tra xem `vnp_TxnRef` của bạn là duy nhất cho ngày đã cho.

### IPN Không Được Nhận

**Vấn đề**: Bạn không nhận được thông báo IPN sau khi thanh toán.

**Giải pháp**:
- Xác minh URL IPN của bạn được cấu hình chính xác trong cổng thông tin VNPay.
- Đảm bảo máy chủ của bạn có thể truy cập công khai và có thể nhận các yêu cầu POST.
- Kiểm tra cài đặt tường lửa của máy chủ để cho phép các yêu cầu đến từ địa chỉ IP của VNPay.
- Trong môi trường phát triển, sử dụng dịch vụ như [ngrok](https://ngrok.com/) để phơi bày máy chủ cục bộ của bạn.

### Lỗi URL Trả Về

**Vấn đề**: Người dùng không được chuyển hướng đúng cách sau khi thanh toán.

**Giải pháp**:
- Đảm bảo `vnp_ReturnUrl` của bạn có thể truy cập công khai.
- Kiểm tra xem URL được mã hóa chính xác trong URL thanh toán.
- Xác minh trình xử lý route được triển khai chính xác.

### Tính Toán Số Tiền Không Chính Xác

**Vấn đề**: Số tiền không được xử lý chính xác.

**Giải pháp**:
- Nhớ rằng thư viện tự động nhân số tiền của bạn với 100 trước khi gửi đến VNPay.
- Đừng tự nhân số tiền; cung cấp số tiền thực tế bằng VND.

### Vấn Đề Sandbox và Production

**Vấn đề**: Mã hoạt động trong sandbox nhưng thất bại trong môi trường production.

**Giải pháp**:
- Đảm bảo bạn đã cập nhật tất cả các giá trị cấu hình cho môi trường production.
- Xác minh thông tin đăng nhập production của bạn với VNPay.
- Kiểm tra xem địa chỉ IP máy chủ của bạn đã được thêm vào danh sách trắng trong môi trường production của VNPay.

## Mẹo Gỡ Lỗi

1. **Bật Ghi Log**: Sử dụng tính năng ghi log tích hợp của thư viện để nắm bắt thông tin chi tiết về các yêu cầu và phản hồi.

```typescript
const vnpay = new VNPay({
    // ... cấu hình khác
    enableLog: true,
    loggerFn: (data) => {
        console.log(JSON.stringify(data, null, 2));
        // Hoặc lưu vào tệp/cơ sở dữ liệu
    }
});
```

2. **Kiểm Tra Yêu Cầu Mạng**: Sử dụng công cụ phát triển trình duyệt hoặc giám sát phía máy chủ để kiểm tra các yêu cầu và phản hồi thô.

3. **Xác Thực Dữ Liệu Đầu Vào**: Kiểm tra kỹ tất cả các tham số đầu vào trước khi gửi chúng đến VNPay.

4. **Kiểm Tra với Thẻ Thử Nghiệm của VNPay**: Sử dụng [số thẻ thử nghiệm](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#th%E1%BA%BB-test) được cung cấp bởi VNPay cho thử nghiệm sandbox.

## Nhận Trợ Giúp

Nếu bạn tiếp tục gặp vấn đề sau khi thử các bước xử lý sự cố này, bạn có thể:

1. Mở một [issue trên GitHub](https://github.com/lehuygiang28/vnpay/issues)
2. Kiểm tra các [thảo luận](https://github.com/lehuygiang28/vnpay/discussions) hiện có
3. Liên hệ trực tiếp với hỗ trợ VNPay cho các vấn đề liên quan đến tài khoản hoặc API 