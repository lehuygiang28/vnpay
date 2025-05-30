import {
    GET_BANK_LIST_ENDPOINT,
    PAYMENT_ENDPOINT,
    QUERY_DR_REFUND_ENDPOINT,
} from '../../src/constants';
import { HashAlgorithm, ProductCode, VnpCurrCode, VnpLocale } from '../../src/enums';
import type { GlobalConfig } from '../../src/types';
import { resolveUrlString } from '../../src/utils/common';
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
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: '/paymentv2/vpcpay.html',
                },
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
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: '/paymentv2/vpcpay.html',
                },
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

        it('should correctly use custom endpoints.paymentEndpoint when provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html', // Default endpoint
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: '/api/custom-payment-endpoint', // Custom endpoint
                },
            };
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: 'Payment for order #1234567890',
            };
            const paymentUrl = createPaymentUrl({ config, data });

            // Should use the custom endpoint, not the default one
            expect(paymentUrl.toString()).toBe(
                'https://sandbox.vnpayment.vn/api/custom-payment-endpoint?vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890',
            );

            // Ensure it is NOT using the default endpoint
            expect(paymentUrl.toString()).not.toContain('/paymentv2/vpcpay.html');
        });

        it('should fallback to deprecated paymentEndpoint when endpoints.paymentEndpoint is not provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/deprecated-payment-endpoint.html', // Deprecated endpoint
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    // No paymentEndpoint provided here
                },
            };
            const data = {
                vnp_Amount: 10000,
                vnp_TnxRef: '1234567890',
                vnp_OrderInfo: 'Payment for order #1234567890',
            };
            const paymentUrl = createPaymentUrl({ config, data });

            // Should use the deprecated paymentEndpoint
            expect(paymentUrl.toString()).toBe(
                'https://sandbox.vnpayment.vn/deprecated-payment-endpoint.html?vnp_Amount=10000&vnp_OrderInfo=Payment+for+order+%231234567890&vnp_TnxRef=1234567890',
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

    describe('Custom Endpoints Configuration', () => {
        it('should use custom payment endpoint when provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/paymentv2/vpcpay.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: '/api/custom-payment-endpoint',
                    queryDrRefundEndpoint: QUERY_DR_REFUND_ENDPOINT,
                    getBankListEndpoint: GET_BANK_LIST_ENDPOINT,
                },
            };

            const data = { test: 'data' };
            const url = createPaymentUrl({ config, data });

            expect(url.toString()).toContain('/api/custom-payment-endpoint');
            expect(url.toString()).not.toContain(PAYMENT_ENDPOINT);
        });

        it('should use custom queryDrRefundEndpoint when provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: PAYMENT_ENDPOINT,
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: PAYMENT_ENDPOINT,
                    queryDrRefundEndpoint: '/api/custom-query-refund-endpoint',
                    getBankListEndpoint: GET_BANK_LIST_ENDPOINT,
                },
            };

            // Test that the URL is constructed correctly
            const queryUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.queryDrRefundEndpoint as string,
            );

            expect(queryUrl).toBe('https://sandbox.vnpayment.vn/api/custom-query-refund-endpoint');
            expect(queryUrl).not.toContain(QUERY_DR_REFUND_ENDPOINT);
        });

        it('should use custom getBankListEndpoint when provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: PAYMENT_ENDPOINT,
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: PAYMENT_ENDPOINT,
                    queryDrRefundEndpoint: QUERY_DR_REFUND_ENDPOINT,
                    getBankListEndpoint: '/api/custom-bank-list-endpoint',
                },
            };

            // Test that the URL is constructed correctly
            const bankListUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.getBankListEndpoint as string,
            );

            expect(bankListUrl).toBe('https://sandbox.vnpayment.vn/api/custom-bank-list-endpoint');
            expect(bankListUrl).not.toContain(GET_BANK_LIST_ENDPOINT);
        });

        it('should use all custom endpoints when provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: '/default-payment-endpoint.html',
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    paymentEndpoint: '/api/custom-payment-endpoint',
                    queryDrRefundEndpoint: '/api/custom-query-refund-endpoint',
                    getBankListEndpoint: '/api/custom-bank-list-endpoint',
                },
            };

            // Test payment endpoint
            const paymentUrl = createPaymentUrl({
                config,
                data: { test: 'data' },
            });

            expect(paymentUrl.toString()).toContain('/api/custom-payment-endpoint');
            expect(paymentUrl.toString()).not.toContain('/default-payment-endpoint.html');

            // Test query refund endpoint
            const queryUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.queryDrRefundEndpoint as string,
            );

            expect(queryUrl).toBe('https://sandbox.vnpayment.vn/api/custom-query-refund-endpoint');
            expect(queryUrl).not.toContain(QUERY_DR_REFUND_ENDPOINT);

            // Test bank list endpoint
            const bankListUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.getBankListEndpoint as string,
            );

            expect(bankListUrl).toBe('https://sandbox.vnpayment.vn/api/custom-bank-list-endpoint');
            expect(bankListUrl).not.toContain(GET_BANK_LIST_ENDPOINT);
        });

        it('should fall back to default endpoints when custom ones are not provided', () => {
            const config: GlobalConfig = {
                vnpayHost: 'https://sandbox.vnpayment.vn',
                queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
                paymentEndpoint: PAYMENT_ENDPOINT,
                vnp_Version: '2.1.0',
                secureSecret: 'YOUR_SECURE_SECRET',
                tmnCode: 'YOUR_TMN_CODE',
                vnp_Command: 'pay',
                vnp_CurrCode: VnpCurrCode.VND,
                vnp_Locale: VnpLocale.VN,
                vnp_OrderType: ProductCode.Other,
                endpoints: {
                    // No endpoints provided here
                },
            };

            // Test payment endpoint fallback
            const paymentUrl = createPaymentUrl({
                config,
                data: { test: 'data' },
            });

            expect(paymentUrl.toString()).toContain(PAYMENT_ENDPOINT);

            // Test query refund endpoint fallback
            const queryUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.queryDrRefundEndpoint || QUERY_DR_REFUND_ENDPOINT,
            );

            expect(queryUrl).toContain(QUERY_DR_REFUND_ENDPOINT);

            // Test bank list endpoint fallback
            const bankListUrl = resolveUrlString(
                config.vnpayHost,
                config.endpoints.getBankListEndpoint || GET_BANK_LIST_ENDPOINT,
            );

            expect(bankListUrl).toContain(GET_BANK_LIST_ENDPOINT);
        });
    });
});
