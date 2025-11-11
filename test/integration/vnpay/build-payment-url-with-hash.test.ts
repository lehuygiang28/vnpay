import { consoleLogger, ignoreLogger } from '../../../src/utils';
import { createBuildPaymentUrlInput, createTestVNPayInstance } from '../../__helpers__';
import { spyOnConsoleLog } from '../../__helpers__/console-helpers';

describe('buildPaymentUrl with withHash option', () => {
    let vnpay: ReturnType<typeof createTestVNPayInstance>;

    beforeAll(() => {
        vnpay = createTestVNPayInstance({
            loggerFn: ignoreLogger,
        });
    });

    it('should include vnp_SecureHash in returned URL and in logged paymentUrl when withHash=true', () => {
        // Arrange
        const input = createBuildPaymentUrlInput();
        const consoleLogMock = spyOnConsoleLog();

        // Act
        const result = vnpay.buildPaymentUrl(input, {
            withHash: true,
            logger: {
                loggerFn: consoleLogger,
            },
        });
        const url = new URL(result);

        // Assert
        expect(url.searchParams.get('vnp_SecureHash')).toBeTruthy();
        expect(result).toContain('vnp_SecureHash=');

        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentUrl: expect.stringContaining('vnp_SecureHash='),
            }),
        );

        consoleLogMock.mockRestore();
    });
});
