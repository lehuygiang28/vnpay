import {
    createTestVNPayInstance,
    DEFAULT_BANK_LIST,
    DEFAULT_VNPAY_CONFIG,
} from '../../__helpers__';
import { mockFetchSuccess, mockFetchError } from '../../__helpers__/mock-helpers';

global.fetch = jest.fn();

describe('VNPay.getBankList', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and return the bank list with resolved logo links', async () => {
        // Arrange
        const mockBankList = DEFAULT_BANK_LIST;
        mockFetchSuccess(mockBankList);

        // Act
        const bankList = await vnpay.getBankList();

        // Assert
        expect(bankList).toEqual([
            {
                bank_code: 'NCB',
                bank_name: 'NCB Bank',
                logo_link: `${DEFAULT_VNPAY_CONFIG.vnpayHost}/images/ncb.png`,
                bank_type: 1,
                display_order: 1,
            },
            {
                bank_code: 'VCB',
                bank_name: 'Vietcombank',
                logo_link: `${DEFAULT_VNPAY_CONFIG.vnpayHost}/images/vcb.png`,
                bank_type: 1,
                display_order: 1,
            },
        ]);

        // Verify fetch was called with correct arguments
        expect(global.fetch).toHaveBeenCalledWith(
            `${DEFAULT_VNPAY_CONFIG.vnpayHost}/qrpayauth/api/merchant/get_bank_list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tmn_code=${DEFAULT_VNPAY_CONFIG.tmnCode}`,
            },
        );
    });

    it('should throw error when fetch fails with non-ok response', async () => {
        // Arrange
        mockFetchError(500, 'Internal Server Error');

        // Act & Assert
        await expect(vnpay.getBankList()).rejects.toThrow('Failed to fetch bank list: HTTP 500');
    });

    it('should handle logo_link without leading slash', async () => {
        // Arrange
        const mockBankList = [
            {
                bank_code: 'TCB',
                bank_name: 'Techcombank',
                logo_link: 'images/tcb.png', // No leading slash
                bank_type: 1,
                display_order: 1,
            },
        ];
        mockFetchSuccess(mockBankList);

        // Act
        const bankList = await vnpay.getBankList();

        // Assert
        expect(bankList[0].logo_link).toBe(`${DEFAULT_VNPAY_CONFIG.vnpayHost}/images/tcb.png`);
    });

    it('should handle empty logo_link', async () => {
        // Arrange
        const mockBankList = [
            {
                bank_code: 'ACB',
                bank_name: 'ACB Bank',
                logo_link: '', // Empty string
                bank_type: 1,
                display_order: 1,
            },
        ];
        mockFetchSuccess(mockBankList);

        // Act
        const bankList = await vnpay.getBankList();

        // Assert
        expect(bankList[0].logo_link).toBe(`${DEFAULT_VNPAY_CONFIG.vnpayHost}/`);
    });
});
