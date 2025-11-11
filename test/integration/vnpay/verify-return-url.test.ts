import { HashAlgorithm, VnpLocale } from '../../../src/enums';
import type { VerifyReturnUrl } from '../../../src/types';
import { consoleLogger, ignoreLogger } from '../../../src/utils';
import { getResponseByStatusCode } from '../../../src/utils/common';
import { buildPaymentUrlSearchParams, calculateSecureHash } from '../../../src/utils/payment.util';
import { createReturnQueryInput, createTestVNPayInstance, TEST_CONSTANTS } from '../../__helpers__';
import { spyOnConsoleLog } from '../../__helpers__/console-helpers';

describe('verifyReturnUrl', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;
    let validInput: ReturnType<typeof createReturnQueryInput>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance({
            testMode: true,
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
        const result = vnpay.verifyReturnUrl(input);

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
                const result = vnpay.verifyReturnUrl(input);

                // Assert
                expect(result).toEqual(expect.objectContaining({ vnp_Amount: expectedAmount }));
            });
        },
    );

    it('should return a correct success result', () => {
        // Arrange
        const input = validInput;

        // Act
        const result = vnpay.verifyReturnUrl(input);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: true,
                isVerified: true,
            } as VerifyReturnUrl),
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
        const result = vnpay.verifyReturnUrl(input);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: false,
                isVerified: true,
            } as VerifyReturnUrl),
        );
    });

    it('should return a correct failed result with invalid secure hash', () => {
        // Arrange
        const input = createReturnQueryInput({
            vnp_ResponseCode: '99',
        });

        // Act
        const result = vnpay.verifyReturnUrl(input);

        // Assert
        expect(result).toEqual(
            expect.objectContaining({
                isSuccess: false,
                isVerified: false,
            } as VerifyReturnUrl),
        );
    });

    it('should convert string amount and remain verified when signature matches', () => {
        // Arrange
        const base = createReturnQueryInput();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { vnp_SecureHash: _oldHash, ...clone } = base as any;
        clone.vnp_Amount = '1000000';

        const search = buildPaymentUrlSearchParams(clone);
        const newHash = calculateSecureHash({
            secureSecret: 'test_secret',
            data: search.toString(),
            hashAlgorithm: HashAlgorithm.SHA512,
            bufferEncode: 'utf-8',
        });

        const input = {
            ...clone,
            vnp_SecureHash: newHash,
        } as any;

        // Act
        const result = vnpay.verifyReturnUrl(input);

        // Assert
        expect(result.isVerified).toBe(true);
        expect(result.vnp_Amount).toBe(10000);
    });

    it('should throw error if amount is invalid', () => {
        // Arrange
        const query = createReturnQueryInput({
            vnp_Amount: TEST_CONSTANTS.INVALID_AMOUNT_STRING,
        });

        // Act & Assert
        expect(() => vnpay.verifyReturnUrl(query)).toThrowError('Invalid amount');
    });

    it('should convert vnp_Amount from string to number', () => {
        // Arrange
        const query = createReturnQueryInput({
            vnp_Amount: '1000000',
        });

        // Act
        const result = vnpay.verifyReturnUrl(query);

        // Assert
        expect(result).toEqual(expect.objectContaining({ vnp_Amount: 10000 }));
    });

    it('should log the object to the console', () => {
        // Arrange
        const input = createReturnQueryInput();
        const consoleLogMock = spyOnConsoleLog();

        // Act
        vnpay.verifyReturnUrl(input, {
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
        vnpay.verifyReturnUrl(input, {
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

    it('should map message for empty response code when signature is valid', () => {
        // Arrange: start from a valid input, but change vnp_ResponseCode to undefined and recompute hash
        const base = createReturnQueryInput();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { vnp_SecureHash: _oldHash, ...clone } = base as any;
        delete (clone as any).vnp_ResponseCode;

        const search = buildPaymentUrlSearchParams(clone);
        const newHash = calculateSecureHash({
            secureSecret: 'test_secret',
            data: search.toString(),
            hashAlgorithm: HashAlgorithm.SHA512,
            bufferEncode: 'utf-8',
        });

        const input = {
            ...clone,
            vnp_SecureHash: newHash,
        } as any;

        // Act
        const result = vnpay.verifyReturnUrl(input);

        // Assert
        expect(result.isVerified).toBe(true);
        expect(result.isSuccess).toBe(false);
        expect(result.message).toBe(getResponseByStatusCode('', VnpLocale.VN));
    });

    it('should ignore vnp_SecureHashType during verification', () => {
        // Arrange: Start from a valid, already-signed input, then append vnp_SecureHashType
        const input = createReturnQueryInput();
        (input as any).vnp_SecureHashType = 'SHA512';

        // Act
        const result = vnpay.verifyReturnUrl(input);

        // Assert: verification should succeed and message map should be for '00'
        expect(result.isVerified).toBe(true);
        expect(result.isSuccess).toBe(true);
        expect(result.message).toBe(getResponseByStatusCode('00', VnpLocale.VN));
    });
});
