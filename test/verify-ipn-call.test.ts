import { VNPay } from '../src/vnpay';
import { VnpCardType } from '../src/enums';
import type { ReturnQueryFromVNPay, VerifyIpnCall } from '../src/types';
import { consoleLogger, ignoreLogger } from '../src/utils';

describe('verifyIpnCall', () => {
    let vnpay: VNPay;
    let validInput: ReturnQueryFromVNPay;

    beforeAll(() => {
        vnpay = new VNPay({
            vnpayHost: 'http://sandbox.vnpayment.vn',
            tmnCode: 'TEST_TMN_CODE',
            secureSecret: 'test_secret',
            enableLog: true,
            /**
             * Ignore log global, since it's for test only
             * If need test log feature, re-enable it in method scope
             */
            loggerFn: ignoreLogger,
        });
        validInput = {
            vnp_Amount: 1000000,
            vnp_BankCode: 'NCB',
            vnp_BankTranNo: 'VNP14422574',
            vnp_CardType: 'ATM',
            vnp_OrderInfo: 'Thanh toan don hang 2024-05-21T02:17:31.249Z',
            vnp_PayDate: '20240521091806',
            vnp_ResponseCode: '00',
            vnp_TmnCode: 'TEST_TMN_CODE',
            vnp_TransactionNo: '14422574',
            vnp_TransactionStatus: '00',
            vnp_TxnRef: '1716257871703',
            vnp_SecureHash:
                '649982421beb422556a1374713c74e58e716ecbd05007c0c0e1f7effdfaf361dbf146889ca446139afe11b9954c4d5c486e99e3b86fcfab6957f29eb0be72895',
        };
    });

    it('should return a correct data with data input', () => {
        // Arrange
        const input: ReturnQueryFromVNPay = { ...validInput };
        const {
            vnp_TxnRef,
            vnp_OrderInfo,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_ResponseCode,
            vnp_PayDate,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
        } = input;
        const expectedOutput = {
            vnp_TxnRef,
            vnp_OrderInfo,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_ResponseCode,
            vnp_PayDate,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
        };

        // Act
        const result = vnpay.verifyIpnCall(input);

        // Assert
        expect(result).toEqual(expect.objectContaining(expectedOutput));
    });

    describe.each([
        [1000000, 10000],
        [2000000, 20000],
        [1650000, 16500],
        [1234500, 12345],
        [123450000, 1234500],
    ])('should return a data with amount is divided by 100', (inputAmount, expectedAmount) => {
        it(`should return ${expectedAmount} when input is ${inputAmount}`, () => {
            // Arrange
            const input: ReturnQueryFromVNPay = {
                ...validInput,
                vnp_Amount: inputAmount,
            };

            // Act
            const result = vnpay.verifyIpnCall(input);

            // Assert
            expect(result).toEqual(expect.objectContaining({ vnp_Amount: expectedAmount }));
        });
    });

    it('should return a correct success result', () => {
        // Act
        const result = vnpay.verifyIpnCall(validInput);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: true,
                isVerified: true,
            } as VerifyIpnCall),
        );
    });

    it('should return a correct failed result', () => {
        // Arrange
        const input: ReturnQueryFromVNPay = {
            ...validInput,
            vnp_ResponseCode: '99',
            vnp_SecureHash:
                '503194f6d93b57b357b2d1d09742565e67e86d771352c5dca4fc8d39df3d392c6b3809add9405f97cfb9631f445e36c80656cfbf47eac67d97fa165865c13e1b',
        };

        // Act
        const result = vnpay.verifyIpnCall(input);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: false,
                isVerified: true,
            } as VerifyIpnCall),
        );
    });

    it('should return a correct failed result with invalid secure hash', () => {
        // Arrange
        const input: ReturnQueryFromVNPay = {
            ...validInput,
            vnp_ResponseCode: '99',
        };

        // Act
        const result = vnpay.verifyIpnCall(input);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: false,
                isVerified: false,
            } as VerifyIpnCall),
        );
    });

    it('should log the object to the console', () => {
        // Arrange
        const input: ReturnQueryFromVNPay = { ...validInput };
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        // Act
        vnpay.verifyIpnCall(input, {
            logger: {
                loggerFn: consoleLogger,
            },
        });

        // Assert
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                vnp_TxnRef: expect.any(String),
                vnp_Amount: expect.any(Number),
            }),
        );
        consoleLogMock.mockRestore();
    });

    it('should log the object to the console with secure hash', () => {
        // Arrange
        const input: ReturnQueryFromVNPay = { ...validInput };
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

        // Act
        vnpay.verifyIpnCall(input, {
            withHash: true,
            logger: {
                loggerFn: consoleLogger,
            },
        });

        // Assert
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                vnp_TxnRef: expect.any(String),
                vnp_Amount: expect.any(Number),
                vnp_SecureHash: expect.any(String),
            }),
        );
        consoleLogMock.mockRestore();
    });
});
