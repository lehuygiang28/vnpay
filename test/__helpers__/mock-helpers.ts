/**
 * Mock fetch helper functions for tests
 */

/**
 * Mocks fetch to return a successful JSON response
 */
export function mockFetchSuccess(data: unknown): void {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(data),
    });
}

/**
 * Mocks fetch to return an error response
 */
export function mockFetchError(status: number, statusText?: string): void {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status,
        statusText: statusText || `HTTP ${status}`,
    });
}

/**
 * Gets the request body from the last fetch call
 */
export function getLastFetchRequestBody(): unknown {
    const fetchCall = (global.fetch as jest.Mock).mock.calls[
        (global.fetch as jest.Mock).mock.calls.length - 1
    ];
    if (!fetchCall || !fetchCall[1]?.body) {
        return null;
    }
    return JSON.parse(fetchCall[1].body);
}

/**
 * Gets the URL from the last fetch call
 */
export function getLastFetchUrl(): string | null {
    const fetchCall = (global.fetch as jest.Mock).mock.calls[
        (global.fetch as jest.Mock).mock.calls.length - 1
    ];
    return fetchCall?.[0] || null;
}
