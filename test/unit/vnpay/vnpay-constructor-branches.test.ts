import { VNPAY_GATEWAY_SANDBOX_HOST } from '../../../src/constants';
import { HashAlgorithm } from '../../../src/enums';
import { VNPay } from '../../../src/vnpay';
import { DEFAULT_VNPAY_CONFIG } from '../../__helpers__';

describe('VNPay constructor branches', () => {
    it('forces sandbox hosts when testMode=true', async () => {
        // Arrange: provide a non-sandbox host, but enable test mode
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });
        (global as unknown as { fetch: typeof fetch }).fetch = mockFetch;

        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            vnpayHost: 'https://production.example.com',
            queryDrAndRefundHost: 'https://production.example.com',
            testMode: true,
        });

        // Act: any network-bound method should use sandbox host when testMode=true
        await vnpay.getBankList();

        // Assert: URL forced to sandbox host
        const calledUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string;
        expect(calledUrl.startsWith(VNPAY_GATEWAY_SANDBOX_HOST)).toBe(true);
    });

    it('applies endpoints overrides and custom hashAlgorithm', () => {
        // Arrange
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            hashAlgorithm: HashAlgorithm.SHA256,
            endpoints: {
                paymentEndpoint: '/custom/payment',
                queryDrRefundEndpoint: '/custom/query-refund',
                getBankListEndpoint: '/custom/banks',
            },
        });

        // Act: build payment URL should use custom payment endpoint
        const url = vnpay.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_TxnRef: 'TXN123',
            vnp_OrderInfo: 'Test order',
        });

        // Assert: custom endpoint path and hash length for SHA256 (64 hex chars)
        expect(new URL(url).pathname).toContain('/custom/payment');
        const hash = new URL(url).searchParams.get('vnp_SecureHash') as string;
        expect(hash).toBeTruthy();
        expect(hash.length).toBe(64);
    });

    it('uses default values when optional config fields are omitted', async () => {
        // Arrange
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });
        (global as unknown as { fetch: typeof fetch }).fetch = mockFetch;

        const vnpay = new VNPay({
            tmnCode: 'TMN_NO_OPTIONALS',
            secureSecret: 'secret',
        });

        // Act
        await vnpay.getBankList();

        // Assert defaults
        expect(vnpay.defaultConfig.vnp_Command).toBe('pay');
        const fetchUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string;
        expect(fetchUrl.startsWith(VNPAY_GATEWAY_SANDBOX_HOST)).toBe(true);

        // And default hash algorithm SHA512 -> 128 hex chars when building payment URL
        const url = vnpay.buildPaymentUrl({
            vnp_Amount: 100000,
            vnp_IpAddr: '127.0.0.1',
            vnp_ReturnUrl: 'https://example.com/return',
            vnp_TxnRef: 'TXNDEF',
            vnp_OrderInfo: 'Default algo test',
        });
        const hash = new URL(url).searchParams.get('vnp_SecureHash') as string;
        expect(hash).toBeTruthy();
        expect(hash.length).toBe(128);
    });
});
