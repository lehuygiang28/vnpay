import { getLastFetchUrl } from '../../__helpers__';
import { getLastFetchRequestBody, mockFetchSuccess } from '../../__helpers__/mock-helpers';

describe('mock-helpers branches', () => {
    beforeEach(() => {
        // @ts-ignore
        global.fetch = jest.fn();
        jest.clearAllMocks();
    });

    it('getLastFetchRequestBody returns null when last fetch call has no body', () => {
        // Arrange: make a fetch call without a body
        (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: jest.fn() });
        // Simulate a call
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.fetch('http://example.com', { method: 'GET' });

        // Act
        const body = getLastFetchRequestBody();

        // Assert
        expect(body).toBeNull();
    });

    it('getLastFetchRequestBody returns parsed JSON when body exists', () => {
        // Arrange: call a helper that triggers a fetch with body
        mockFetchSuccess({ ok: true });
        // Simulate a call with body
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        global.fetch('http://example.com', { method: 'POST', body: JSON.stringify({ a: 1 }) });

        // Act
        const body = getLastFetchRequestBody();

        // Assert
        expect(body).toEqual({ a: 1 });
    });

    it('getLastFetchUrl returns null when no fetch calls were made', () => {
        // No fetch invocation
        const url = getLastFetchUrl();
        expect(url).toBeNull();
    });
});
