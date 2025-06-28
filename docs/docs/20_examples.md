# Các ví dụ

## 🚀 Dự án mẫu Full-stack

### Next.js 15 Full-stack Example

- **GitHub**: [lehuygiang28/vnpay-nextjs-fullstack-example](https://github.com/lehuygiang28/vnpay-nextjs-fullstack-example)
- **Live Demo**: [vnpay-nextjs-fullstack-example.vercel.app](https://vnpay-nextjs-fullstack-example.vercel.app/)
- **Công nghệ**: Next.js 15, TypeScript, Tailwind CSS, Server Actions

**Tính năng nổi bật:**
- ✅ **Server-side VNPay integration** - Xử lý thanh toán hoàn toàn trên server
- ✅ **Next.js 15 App Router** với Server Actions và API Routes
- ✅ **IPN Handler** - Xử lý webhook từ VNPay
- ✅ **Types-only imports** cho frontend components
- ✅ **Responsive UI** với Tailwind CSS
- ✅ **Demo sandbox environment** với test data

### Express MVC Example

- **GitHub**: [lehuygiang28/vnpay-mvc-example](https://github.com/lehuygiang28/vnpay-mvc-example)
- **Live Demo**: [vnpay-mvc-example.vercel.app](https://vnpay-mvc-example.vercel.app/)
- **Công nghệ**: Express, TypeScript, Bootstrap 5, Handlebars

## 📋 Ví dụ sử dụng cơ bản

### Các phương thức thư viện

Xem các ví dụ về cách sử dụng tất cả các phương thức thư viện [tại đây](https://github.com/lehuygiang28/vnpay/blob/main/example/index.ts)

### Triển khai với Express

Xem ví dụ triển khai hoàn chỉnh với Express [tại đây](https://github.com/lehuygiang28/vnpay/blob/main/example/express.ts)

## 🏗️ Kiến trúc Full-stack đúng cách

### ⚠️ Nguyên tắc quan trọng

:::danger CẢNH BÁO
**Thư viện VNPay chỉ dành cho Node.js backend!** Không thể sử dụng trực tiếp trong React/Vue/Angular components vì:

- 🚫 Sử dụng Node.js modules: `fs`, `crypto`, `path`  
- 🚫 Chứa logic server-side để bảo mật `secureSecret`
- 🚫 Sẽ gây lỗi build khi import vào client components
:::

### ✅ Kiến trúc khuyến nghị

```
┌─────────────────┐    API calls    ┌─────────────────┐
│   Frontend      │ ──────────────► │   Backend       │
│                 │                 │                 │
│ • React/Vue     │                 │ • Node.js       │
│ • Types only    │                 │ • VNPay library │
│ • UI components │ ◄────────────── │ • Payment logic │
└─────────────────┘   JSON response └─────────────────┘
```

### 💼 Ví dụ Backend (Node.js/Express)

```typescript
// backend/routes/payment.ts
import { VNPay } from 'vnpay'; // ✅ Import đầy đủ trên backend

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE!,
  secureSecret: process.env.VNP_SECRET!,
  testMode: true
});

// Tạo URL thanh toán
app.post('/api/payments/create', async (req, res) => {
  try {
    const { amount, orderInfo } = req.body;
    
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: `${process.env.APP_URL}/payment/callback`,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo,
    });
    
    res.json({ success: true, paymentUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xác thực kết quả thanh toán
app.get('/api/payments/verify', (req, res) => {
  const verification = vnpay.verifyReturnUrl(req.query);
  res.json(verification);
});
```

### 🎨 Ví dụ Frontend (React/Next.js)

```typescript
// frontend/components/PaymentButton.tsx
import { useState } from 'react';
import type { VerifyReturnUrl } from 'vnpay/types-only'; // ✅ Chỉ import types

interface PaymentButtonProps {
  amount: number;
  orderInfo: string;
  onPaymentResult?: (result: VerifyReturnUrl) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  amount, 
  orderInfo, 
  onPaymentResult 
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // ✅ Gọi API backend thay vì import trực tiếp
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, orderInfo }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Chuyển hướng đến VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert('Lỗi tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Đang xử lý...' : `Thanh toán ${amount.toLocaleString()} VND`}
    </button>
  );
};
```

### 🔐 IPN Handler Example

```typescript
// backend/routes/ipn.ts
app.post('/api/payment/ipn', (req, res) => {
  try {
    const verification = vnpay.verifyIpnCall(req.body);
    
    if (verification.isSuccess) {
      // ✅ Thanh toán thành công - cập nhật database
      console.log('Payment successful:', verification.vnp_TxnRef);
      
      // Cập nhật order status trong database
      // updateOrderStatus(verification.vnp_TxnRef, 'PAID');
      
      res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
      // ❌ Thanh toán thất bại
      console.log('Payment failed:', verification.message);
      res.status(200).json({ RspCode: '01', Message: 'fail' });
    }
  } catch (error) {
    console.error('IPN processing error:', error);
    res.status(500).json({ RspCode: '99', Message: 'error' });
  }
});
```

## 🎯 Lưu ý quan trọng cho Frontend

### ❌ KHÔNG làm thế này

```typescript
// 🚫 SẼ GÂY LỖI BUILD!
import { VNPay } from 'vnpay';
// Error: Module not found: Can't resolve 'fs'

const MyComponent = () => {
  const vnpay = new VNPay(config); // ❌ Không thể làm trong browser!
  return <div>Payment</div>;
};
```

### ✅ SỬ DỤNG đúng cách

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
```

## 📚 Tài nguyên thêm

- **📖 VNPay Documentation**: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis/)
- **🔧 Next.js Server Actions**: [nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- **🎨 Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **📦 vnpay npm package**: [npmjs.com/package/vnpay](https://www.npmjs.com/package/vnpay)
