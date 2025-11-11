import { createTestVNPayInstance, DEFAULT_BANK_LIST, DEFAULT_VNPAY_CONFIG } from '../__helpers__';
import { mockFetchSuccess } from '../__helpers__/mock-helpers';

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
});
