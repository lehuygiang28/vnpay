# Cài đặt URL IPN

Khi thanh toán hoàn tất, VNPay sẽ gửi một thông báo IPN (Instant Payment Notification) đến URL IPN mà bạn đã cấu hình. Để xác thực thông báo IPN, bạn có thể sử dụng thư viện VNPay.

## Cài đặt URL IPN cho môi trường Sandbox

:::caution Lưu ý
Để cài đặt URL IPN cho môi trường production, bạn cần liên hệ trực tiếp với VNPay để được hỗ trợ.
:::

### Truy cập nhanh (Sau khi đăng nhập)

Sau khi đăng nhập vào cổng thông tin merchant của VNPay, bạn có thể truy cập trực tiếp vào trang cấu hình Terminal (nơi cài đặt URL IPN) bằng cách truy cập:

```text
https://sandbox.vnpayment.vn/merchantv2/Account/TerminalEdit.htm
```

### Cách cài đặt theo từng bước

1. Đăng nhập vào cổng thông tin merchant của VNPay [tại đây](https://sandbox.vnpayment.vn/merchantv2/Users/Login.htm)
2. Ở góc trên bên phải, chọn `Thông tin tài khoản`:
 <p align="center">
     ![Chọn thông tin tài khoản](/img/ipn-step-2.png)
 </p>
3. Sau khi chọn thông tin tài khoản, VNPay sẽ hiển thị danh sách các website. Bạn không cần quan tâm đến danh sách này.
4. Từ bất kỳ website nào trong danh sách, cuộn sang phải và nhấp vào biểu tượng chỉnh sửa:
 <p align="center">
     ![Chọn biểu tượng chỉnh sửa](/img/ipn-step-4.png)
 </p>
5. Cấu hình URL IPN:
 <p align="center">
     ![Cấu hình IPN](/img/ipn-step-5.png)
 </p>

## Cài đặt URL IPN cho môi trường Production

:::caution Lưu ý
Để cài đặt URL IPN cho môi trường production, bạn cần liên hệ trực tiếp với VNPay để được hỗ trợ.
:::
