# Examples

## 🚀 Full-stack Sample Projects

### Next.js 15 Full-stack Example

- **GitHub**: [lehuygiang28/vnpay-nextjs-fullstack-example](https://github.com/lehuygiang28/vnpay-nextjs-fullstack-example)
- **Live Demo**: [vnpay-nextjs-fullstack-example.vercel.app](https://vnpay-nextjs-fullstack-example.vercel.app/)
- **Technologies**: Next.js 15, TypeScript, Tailwind CSS, Server Actions

**Key Features:**

- ✅ **Server-side VNPay integration** - All payment processing on server
- ✅ **Next.js 15 App Router** with Server Actions and API Routes
- ✅ **IPN Handler** - Webhook processing from VNPay
- ✅ **Types-only imports** for frontend components
- ✅ **Responsive UI** with Tailwind CSS
- ✅ **Demo sandbox environment** with test data

### Express MVC Example

- **GitHub**: [lehuygiang28/vnpay-mvc-example](https://github.com/lehuygiang28/vnpay-mvc-example)
- **Live Demo**: [vnpay-mvc-example.vercel.app](https://vnpay-mvc-example.vercel.app/)
- **Technologies**: Express, TypeScript, Bootstrap 5, Handlebars

## 📋 Basic Usage Examples

### Library Methods

See examples of all library methods [here](https://github.com/lehuygiang28/vnpay/blob/main/example/index.ts)

### Express Implementation

See a complete Express implementation example [here](https://github.com/lehuygiang28/vnpay/blob/main/example/express.ts)

## 🏗️ Proper Full-stack Architecture

### ⚠️ Important Principles

:::danger WARNING
**The VNPay library is designed for Node.js backends only!** Cannot be used directly in React/Vue/Angular components because:

- 🚫 Uses Node.js modules: `fs`, `crypto`, `path`
- 🚫 Contains server-side logic to secure `secureSecret`
- 🚫 Will cause build errors when imported in client components
  :::

### ✅ Recommended Architecture

```text
┌─────────────────┐    API calls    ┌─────────────────┐
│   Frontend      │ ──────────────► │   Backend       │
│                 │                 │                 │
│ • React/Vue     │                 │ • Node.js       │
│ • Types only    │                 │ • VNPay library │
│ • UI components │ ◄────────────── │ • Payment logic │
└─────────────────┘   JSON response └─────────────────┘
```

### 💼 Backend Example (Node.js/Express)

```typescript
// backend/routes/payment.ts
import { VNPay } from 'vnpay'; // ✅ Full import on backend

const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMNCODE!,
    secureSecret: process.env.VNP_SECRET!,
    testMode: true,
});

// Create payment URL
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

// Verify the payment result. Accept it only when the signature is valid.
app.get('/api/payments/verify', (req, res) => {
    const verification = vnpay.verifyReturnUrl(req.query);
    if (!verification.isVerified) {
        return res.json({ success: false, message: verification.message });
    }
    res.json({
        success: verification.isSuccess,
        message: verification.message,
        orderId: verification.vnp_TxnRef,
    });
});
```

### 🎨 Frontend Example (React/Next.js)

```typescript
// frontend/components/PaymentButton.tsx
import { useState } from 'react';
import type { VerifyReturnUrl } from 'vnpay/types-only'; // ✅ Types only

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
      // ✅ Call backend API instead of direct import
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, orderInfo }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert('Payment creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Connection error');
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
      {loading ? 'Processing...' : `Pay ${amount.toLocaleString()} VND`}
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

        if (!verification.isVerified) {
            console.log('Invalid checksum:', verification.message);
            return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }

        if (verification.isSuccess) {
            // ✅ Payment successful - update database
            console.log('Payment successful:', verification.vnp_TxnRef);

            // Update order status in database
            // updateOrderStatus(verification.vnp_TxnRef, 'PAID');

            res.status(200).json({ RspCode: '00', Message: 'success' });
        } else {
            // ❌ Payment failed
            console.log('Payment failed:', verification.message);
            res.status(200).json({ RspCode: '01', Message: 'fail' });
        }
    } catch (error) {
        console.error('IPN processing error:', error);
        res.status(500).json({ RspCode: '99', Message: 'error' });
    }
});
```

## 🎯 Important Notes for Frontend

### ❌ DON'T do this

```typescript
// 🚫 WILL CAUSE BUILD ERRORS!
import { VNPay } from 'vnpay';
// Error: Module not found: Can't resolve 'fs'

const MyComponent = () => {
  const vnpay = new VNPay(config); // ❌ Cannot do this in browser!
  return <div>Payment</div>;
};
```

### ✅ CORRECT usage

```typescript
// ✅ Safe - import types only
import type { VNPayConfig, BuildPaymentUrl, Bank, VerifyReturnUrl } from 'vnpay/types-only';

// Or use type import with main package
import type { VNPayConfig } from 'vnpay';

interface PaymentComponentProps {
    config: VNPayConfig;
    onPaymentResult: (result: VerifyReturnUrl) => void;
}
```

## 📚 Additional Resources

- **📖 VNPay Documentation**: [sandbox.vnpayment.vn/apis](https://sandbox.vnpayment.vn/apis/)
- **🔧 Next.js Server Actions**: [nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- **🎨 Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **📦 vnpay npm package**: [npmjs.com/package/vnpay](https://www.npmjs.com/package/vnpay)
