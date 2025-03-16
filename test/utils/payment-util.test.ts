import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from '../../src/enums';
import type { GlobalConfig } from '../../src/types';
import {
    buildPaymentUrlSearchParams,
    calculateSecureHash,
    createPaymentUrl,
    verifySecureHash,
} from '../../src/utils/payment.util';

describe('VNPay Payment Utility Functions', () => {
    describe('buildPaymentUrlSearchParams', () => {
        it('should build search params from data', () => {
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: 'Payment for order #1234567890',
            };
            const searchParams = buildPaymentUrlSearchParams(data);
            expect(searchParams.toString()).toBe(
                'vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890',
            );
        });
        it('should skip empty value', () => {
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: undefined,
            };
            const searchParams = buildPaymentUrlSearchParams(data);
            expect(searchParams.toString()).toBe('vnp_Amount=10000&vnp_TnxRef=1234567890');
        });
    });

    describe('createPaymentUrl', () => {
        it('should create payment url from config and data', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
            };
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: 'Payment for order #1234567890',
            };
            const paymentUrl = createPaymentUrl({ config, data });
            expect(paymentUrl.toString()).toBe(
                'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890',
            );
        });

        it('should create a default payment url', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
            };
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: 'Payment for order #1234567890',
            };
            const paymentUrl = createPaymentUrl({ config, data });
            expect(paymentUrl.toString()).toBe(
                'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890',
            );
        });
    });
    describe('calculateSecureHash', () => {
        it('should calculate secure hash from data', () => {
            const secureSecret = 'YOUR_SECURE_SECRET';
            const data =
                'vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890';
            const hashAlgorithm = HashAlgorithm.SHA512;
            const secureHash = calculateSecureHash({
                secureSecret,
                data,
                hashAlgorithm,
                bufferEncode: 'utf-8',
            });
            expect(secureHash).toBe(
                '7bb8160a5d2085a85b3267817a40ee4f770a335282f19714726e6fc6f28a64c75a1e7e9c1aa96f3cbda5ce44095088fb4cb2af66c596d2f655b0b53966312089',
            );
        });
    });
    describe('verifySecureHash', () => {
        it('should verify secure hash', () => {
            const secureSecret = 'YOUR_SECURE_SECRET';
            const data =
                'vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890';
            const hashAlgorithm = HashAlgorithm.SHA512;
            const receivedHash =
                '7bb8160a5d2085a85b3267817a40ee4f770a335282f19714726e6fc6f28a64c75a1e7e9c1aa96f3cbda5ce44095088fb4cb2af66c596d2f655b0b53966312089';
            const isVerified = verifySecureHash({
                secureSecret,
                data,
                hashAlgorithm,
                receivedHash,
            });
            expect(isVerified).toBe(true);
        });
    });
});
