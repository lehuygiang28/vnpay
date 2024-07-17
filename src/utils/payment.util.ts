import { PAYMENT_ENDPOINT, VNPAY_GATEWAY_SANDBOX_HOST } from '../constants';
import { HashAlgorithm } from '../enums';
import { BuildPaymentUrl, DefaultConfig, GlobalConfig } from '../types';
import { hash, resolveUrlString } from './common';

export function buildPaymentUrlSearchParams(data: Record<string, any>): URLSearchParams {
    const searchParams = new URLSearchParams();
    Object.entries(data)
        .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
        .forEach(([key, value]) => {
            // Skip empty value
            if (value === '' || value === undefined || value === null) {
                return;
            }
            searchParams.set(key, value.toString());
        });
    return searchParams;
}

export function createPaymentUrl(
    config: Pick<GlobalConfig, 'vnpayHost' | 'paymentEndpoint'>,
    data: (BuildPaymentUrl & DefaultConfig) | Record<string, any>,
): URL {
    const redirectUrl = new URL(
        resolveUrlString(
            config.vnpayHost ?? VNPAY_GATEWAY_SANDBOX_HOST,
            config.paymentEndpoint ?? PAYMENT_ENDPOINT,
        ),
    );
    buildPaymentUrlSearchParams(data).forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
    });
    return redirectUrl;
}

export function calculateSecureHash(
    secureSecret: string,
    data: string,
    hashAlgorithm: HashAlgorithm,
    bufferEncode: BufferEncoding = 'utf-8',
): string {
    return hash(secureSecret, Buffer.from(data, bufferEncode), hashAlgorithm);
}

export function verifySecureHash(
    secureSecret: string,
    data: string,
    hashAlgorithm: HashAlgorithm,
    receivedHash: string,
): boolean {
    const calculatedHash = calculateSecureHash(secureSecret, data, hashAlgorithm);
    return calculatedHash === receivedHash;
}
