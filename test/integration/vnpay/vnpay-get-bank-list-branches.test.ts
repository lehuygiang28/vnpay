import { VNPay } from '../../../src/vnpay';
import { DEFAULT_VNPAY_CONFIG } from '../../__helpers__';
import { mockFetchSuccess } from '../../__helpers__/mock-helpers';

global.fetch = jest.fn();

describe('VNPay.getBankList branches', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('uses default sandbox host when vnpayHost is undefined', async () => {
        // Arrange
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            vnpayHost: undefined,
        });
        mockFetchSuccess([]);

        // Act
        await vnpay.getBankList();

        // Assert: the URL should start with the default host
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
        expect(url).toContain('/qrpayauth/api/merchant/get_bank_list');
    });

    it('handles empty bank list (no logo resolution loop iterations)', async () => {
        // Arrange
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
        });
        mockFetchSuccess([]);

        // Act
        const result = await vnpay.getBankList();

        // Assert
        expect(result).toEqual([]);
    });

    it('uses custom vnpayHost when provided (host coalescing true branch)', async () => {
        // Arrange
        const customHost = 'https://custom-vnp-host.example.com';
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            vnpayHost: customHost,
        });
        mockFetchSuccess([]);

        // Act
        await vnpay.getBankList();

        // Assert: URL should start with custom host
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
        expect(url.startsWith(customHost)).toBe(true);
    });

    it('uses custom getBankList endpoint override when provided', async () => {
        // Arrange
        const customEndpoint = '/custom/bank-list';
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            endpoints: {
                paymentEndpoint: DEFAULT_VNPAY_CONFIG.paymentEndpoint as any,
                queryDrRefundEndpoint: DEFAULT_VNPAY_CONFIG.endpoints?.queryDrRefundEndpoint as any,
                getBankListEndpoint: customEndpoint,
            },
        });
        mockFetchSuccess([]);

        // Act
        await vnpay.getBankList();

        // Assert
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
        expect(url).toContain(customEndpoint);
    });

    it('falls back to default endpoint when getBankListEndpoint is falsy', async () => {
        // Arrange
        const vnpay = new VNPay({
            ...DEFAULT_VNPAY_CONFIG,
            endpoints: {
                paymentEndpoint: DEFAULT_VNPAY_CONFIG.paymentEndpoint as any,
                queryDrRefundEndpoint: DEFAULT_VNPAY_CONFIG.endpoints?.queryDrRefundEndpoint as any,
                getBankListEndpoint: '',
            },
        });
        mockFetchSuccess([
            {
                bank_code: 'NCB',
                bank_name: 'NCB',
                logo_link: '/img.png',
                bank_type: 1,
                display_order: 1,
            },
        ]);

        // Act
        await vnpay.getBankList();

        // Assert
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
        expect(url).toContain('/qrpayauth/api/merchant/get_bank_list');
    });
});
