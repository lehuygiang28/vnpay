import type { VerifyIpnCall } from '../../src/types';
import { consoleLogger, ignoreLogger } from '../../src/utils';
import { createReturnQueryInput, createTestVNPayInstance, TEST_CONSTANTS } from '../__helpers__';
import { spyOnConsoleLog } from '../__helpers__/console-helpers';

describe('verifyIpnCall', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;
    let validInput: ReturnType<typeof createReturnQueryInput>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });
        validInput = createReturnQueryInput();
    });

    it('should return a correct data with data input', () => {
        // Arrange
        const input = createReturnQueryInput();
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

    describe.each(TEST_CONSTANTS.AMOUNT_TEST_CASES)(
        'should return a data with amount is divided by 100',
        (inputAmount, expectedAmount) => {
            it(`should return ${expectedAmount} when input is ${inputAmount}`, () => {
                // Arrange
                const input = createReturnQueryInput({
                    vnp_Amount: inputAmount,
                });

                // Act
                const result = vnpay.verifyIpnCall(input);

                // Assert
                expect(result).toEqual(expect.objectContaining({ vnp_Amount: expectedAmount }));
            });
        },
    );

    it('should return a correct success result', () => {
        // Arrange
        const input = validInput;

        // Act
        const result = vnpay.verifyIpnCall(input);

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
        const input = createReturnQueryInput({
            vnp_ResponseCode: '99',
            vnp_SecureHash:
                '503194f6d93b57b357b2d1d09742565e67e86d771352c5dca4fc8d39df3d392c6b3809add9405f97cfb9631f445e36c80656cfbf47eac67d97fa165865c13e1b',
        });

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
        const input = createReturnQueryInput({
            vnp_ResponseCode: '99',
        });

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
        const input = createReturnQueryInput();
        const consoleLogMock = spyOnConsoleLog();

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
        const input = createReturnQueryInput();
        const consoleLogMock = spyOnConsoleLog();

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
