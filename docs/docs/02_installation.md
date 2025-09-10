# Hướng dẫn cài đặt

:::tip
Nếu bạn đang sử dụng [`Nestjs`](https://docs.nestjs.com), hãy cài đặt [`nestjs-vnpay`](https://github.com/lehuygiang28/nestjs-vnpay) - một wrapper tích hợp sẵn cho NestJS.
:::

## Cài đặt với các trình quản lý thư viện

### NPM

```bash
$ npm install vnpay
```

### Yarn

```bash
$ yarn add vnpay
```

### PNPM

```bash
$ pnpm install vnpay
```

## 📦 Tuỳ chọn Import (v2.4.0+)

:::info Mới trong v2.4.0
Bắt đầu từ phiên bản 2.4.0, bạn có thể import các phần cụ thể của thư viện để giảm kích thước bundle!
:::

### 🏆 Import toàn bộ (Backward Compatible)

```typescript
import { VNPay, HashAlgorithm, ProductCode } from 'vnpay';
```

### 🦩 Import theo module (Khuyến nghị)

```typescript
import { VNPay } from 'vnpay/vnpay';
import { HashAlgorithm, ProductCode } from 'vnpay/enums';
import { VNP_VERSION, PAYMENT_ENDPOINT } from 'vnpay/constants';
import { resolveUrlString, dateFormat } from 'vnpay/utils';
```

### 📘 Types-only (TypeScript)

```typescript
import type { VNPayConfig, BuildPaymentUrl, Bank } from 'vnpay/types-only';
```

:::danger CẢNH BÁO QUAN TRỌNG
**Thư viện VNPay được thiết kế dành riêng cho Node.js backend** và **KHÔNG THỂ** sử dụng trực tiếp trong các ứng dụng frontend (React, Vue, Angular, etc.) vì:

- ❌ Sử dụng Node.js modules: `fs`, `crypto`, `path`
- ❌ Chứa logic server-side để bảo mật `secureSecret`
- ❌ Sẽ gây lỗi build khi import vào client components
  :::

#### ❌ KHÔNG làm thế này trong Frontend

```typescript
import { VNPay } from 'vnpay';
```

#### ✅ SỬ DỤNG đúng cách trong Frontend

```typescript
import type { VNPayConfig, BuildPaymentUrl, Bank, VerifyReturnUrl } from 'vnpay/types-only';
```

- **Backend (Node.js)**: Sử dụng import bình thường để xử lý thanh toán
- **Frontend (React/Vue/Angular)**: Chỉ import types để type checking
- **API calls**: Gọi backend APIs từ frontend thay vì import trực tiếp

## Sử dụng thư viện

### Import thư viện

```typescript
// Import toàn bộ (backward compatible)
import { VNPay } from 'vnpay';

// Hoặc import module cụ thể (khuyến nghị cho bundle size nhỏ hơn)
import { VNPay } from 'vnpay/vnpay';
```

### Khởi tạo đối tượng {#init-vnpay}

```typescript
import { VNPay, ignoreLogger } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: 'YOUR_TMNCODE',
    secureSecret: 'YOUR_SECURE_SECRET',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)

    testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
    hashAlgorithm: 'SHA512', // tùy chọn

    /**
     * Bật/tắt ghi log
     * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
     */
    enableLog: true, // tùy chọn

    /**
     * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
     * Mặc định, loggerFn sẽ ghi log ra console
     * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
     *
     * `ignoreLogger` là một hàm không làm gì cả
     */
    loggerFn: ignoreLogger, // tùy chọn

    /**
     * Tùy chỉnh các đường dẫn API của VNPay
     * Thường không cần thay đổi trừ khi:
     * - VNPay cập nhật đường dẫn của họ
     * - Có sự khác biệt giữa môi trường sandbox và production
     */
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    }, // tùy chọn
});
```

### ⚠️ **Hướng dẫn sử dụng trên Client-side (Frontend)**

:::danger CẢNH BÁO QUAN TRỌNG
**Thư viện VNPay được thiết kế dành riêng cho Node.js backend** và **KHÔNG THỂ** sử dụng trực tiếp trong các ứng dụng frontend (React, Vue, Angular, etc.) vì:

- 🚫 Sử dụng Node.js modules: `fs`, `crypto`, `path`
- 🚫 Chứa logic server-side để bảo mật `secureSecret`
- 🚫 Sẽ gây lỗi build khi import vào client components
  :::

#### ❌ **KHÔNG làm thế này trong Frontend**

```typescript
// 🚫 SẼ GÂY LỖI BUILD!
import { VNPay } from 'vnpay';
// Error: Module not found: Can't resolve 'fs'
// Error: Module not found: Can't resolve 'crypto'

const MyComponent = () => {
  const vnpay = new VNPay(config); // ❌ Không thể làm trong browser!
  return <div>Payment</div>;
};
```

#### ✅ **SỬ DỤNG đúng cách trong Frontend**

```typescript
// ✅ An toàn - chỉ import types
import type {
  VNPayConfig,
  BuildPaymentUrl,
  Bank,
  VerifyReturnUrl
} from 'vnpay/types-only';

// Hoặc sử dụng type import với main package
import type { VNPayConfig } from 'vnpay';

interface PaymentComponentProps {
  config: VNPayConfig;
  onPaymentResult: (result: VerifyReturnUrl) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ config, onPaymentResult }) => {
  const handleCreatePayment = async () => {
    // ✅ Gọi API backend thay vì import trực tiếp
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      body: JSON.stringify({ amount: 100000 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const { paymentUrl } = await response.json();
    window.location.href = paymentUrl;
  };

  return (
    <button onClick={handleCreatePayment}>
      Thanh toán VNPay
    </button>
  );
};
```
