import type { Bank } from '../src/types';
import { VNPay } from '../src/vnpay';

global.fetch = jest.fn();

describe('VNPay.getBankList', () => {
    let vnpay: VNPay;

    beforeAll(() => {
        vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: true,
        });
    });

    it('should fetch and return the bank list with resolved logo links', async () => {
        const mockBankList: Bank[] = [
            {
                bank_code: 'NCB',
                bank_name: 'NCB Bank',
                logo_link: '/images/ncb.png',
                bank_type: 1,
                display_order: 1,
            },
            {
                bank_code: 'VCB',
                bank_name: 'Vietcombank',
                logo_link: '/images/vcb.png',
                bank_type: 1,
                display_order: 1,
            },
        ];

        // Mock the fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockBankList),
        });

        const bankList = await vnpay.getBankList();

        expect(bankList).toEqual([
            {
                bank_code: 'NCB',
                bank_name: 'NCB Bank',
                logo_link: 'http://sandbox.vnpayment.vn/images/ncb.png',
                bank_type: 1,
                display_order: 1,
            },
            {
                bank_code: 'VCB',
                bank_name: 'Vietcombank',
                logo_link: 'http://sandbox.vnpayment.vn/images/vcb.png',
                bank_type: 1,
                display_order: 1,
            },
        ]);

        // Verify fetch was called with correct arguments
        expect(global.fetch).toHaveBeenCalledWith(
            'http://sandbox.vnpayment.vn/qrpayauth/api/merchant/get_bank_list',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'tmn_code=TEST_TMN_CODE',
            },
        );
    });
});
