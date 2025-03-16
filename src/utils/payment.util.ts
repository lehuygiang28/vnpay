import crypto from 'crypto';
import { PAYMENT_ENDPOINT, VNPAY_GATEWAY_SANDBOX_HOST } from '../constants';
import type { HashAlgorithm } from '../enums';
import type { BuildPaymentUrl, DefaultConfig, GlobalConfig } from '../types';
import { hash, resolveUrlString } from './common';

/**
 * Hàm tạo các parameter cho query string
 * @en Function to build payment URL search parameters
 */
export function buildPaymentUrlSearchParams(data: Record<string, unknown>): URLSearchParams {
    const params = new URLSearchParams();

    // Sort keys
    const sortedKeys = Object.keys(data).sort();

    // Add sorted parameters
    for (const key of sortedKeys) {
        if (data[key] !== undefined && data[key] !== null) {
            params.append(key, String(data[key]));
        }
    }

    return params;
}

/**
 * Hàm tạo URL thanh toán dựa trên config và data
 * @en Function to create payment URL based on config and data
 */
export function createPaymentUrl({
    config,
    data,
}: {
    config: GlobalConfig;
    data: Record<string, unknown>;
}): URL {
    const redirectUrl = new URL(`${config.vnpayHost}/${config.paymentEndpoint}`);

    const searchParams = buildPaymentUrlSearchParams(data);
    redirectUrl.search = searchParams.toString();

    return redirectUrl;
}

/**
 * Hàm tính toán mã bảo mật
 * @en Function to calculate secure hash
 */
export function calculateSecureHash({
    secureSecret,
    data,
    hashAlgorithm,
    bufferEncode,
}: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    bufferEncode: BufferEncoding;
}): string {
    return crypto
        .createHmac(hashAlgorithm, secureSecret)
        .update(Buffer.from(data, bufferEncode))
        .digest('hex');
}

/**
 * Hàm xác minh mã bảo mật
 * @en Function to verify secure hash
 */
export function verifySecureHash({
    secureSecret,
    data,
    hashAlgorithm,
    receivedHash,
}: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    receivedHash: string;
}): boolean {
    const calculatedHash = crypto
        .createHmac(hashAlgorithm, secureSecret)
        .update(Buffer.from(data, 'utf-8'))
        .digest('hex');

    return calculatedHash === receivedHash;
}
