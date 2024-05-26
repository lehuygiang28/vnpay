import timezone from 'moment-timezone';
import { RESPONSE_MAP } from '../constants/response-map.constant';
import { HashAlgorithm, VnpLocale } from '../enums';
import crypto, { BinaryLike } from 'crypto';

export function getDateInGMT7(date: Date): Date {
    return timezone(new Date()).tz('Asia/Ho_Chi_Minh').toDate();
}

/**
 * Định dạng lại ngày theo định dạng của VNPay, mặc định là yyyyMMddHHmmss
 * @en Format date to VNPay format, default is yyyyMMddHHmmss
 *
 * @param date date to format
 * @param format format of date
 * @returns formatted date
 */
export function dateFormat(date: Date, format = 'yyyyMMddHHmmss'): number {
    const pad = (n: number) => (n < 10 ? `0${n}` : n).toString();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return Number(
        format
            .replace('yyyy', year.toString())
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second),
    );
}

/**
 * Parse a vnpay date format number to date
 * @param dateNumber An vnpay date format number
 * @returns Date
 */
export function parseDate(dateNumber: number | string): Date {
    const dateString = dateNumber.toString();

    const year = parseInt(dateString.slice(0, 4));
    const month = parseInt(dateString.slice(4, 6)) - 1; // months are 0-indexed in JavaScript
    const day = parseInt(dateString.slice(6, 8));
    const hour = parseInt(dateString.slice(8, 10));
    const minute = parseInt(dateString.slice(10, 12));
    const second = parseInt(dateString.slice(12, 14));

    return new Date(year, month, day, hour, minute, second);
}

/**
 * Validate if the date is match with format `yyyyMMddHHmmss` or not
 * @param date The date to be validated
 * @returns True if the date is valid, false otherwise
 */
export function isValidVnpayDateFormat(date: number): boolean {
    const dateString = date.toString();
    const regex =
        /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
    return regex.test(dateString);
}

export function generateRandomString(
    length: number,
    options?: {
        onlyNumber?: boolean;
    },
) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (options?.onlyNumber) {
        characters = '0123456789';
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += `${characters[(Math.random() * charactersLength) | 0]}`;
    }
    return result;
}

/**
 * Lấy thông tin response theo mã response
 * @en Get response message by response code
 *
 * @param responseCode response code from VNPay
 * @param locale locale of response text
 * @param responseMap map of response code and response text if you want to custom
 * @returns message of response code
 */
export function getResponseByStatusCode(
    responseCode: string = '',
    locale: VnpLocale = VnpLocale.VN,
    responseMap = RESPONSE_MAP,
): string {
    const respondText: Record<VnpLocale, string> =
        responseMap.get(responseCode) ?? (responseMap.get('default') as Record<VnpLocale, string>);

    return respondText[locale];
}

export function resolveUrlString(host: string, path: string): string {
    host = host.trim();
    path = path.trim();
    while (host.endsWith('/') || host.endsWith('\\')) {
        host = host.slice(0, -1);
    }
    while (path.startsWith('/') || path.startsWith('\\')) {
        path = path.slice(1);
    }
    return `${host}/${path}`;
}

export function hash(secret: string, data: BinaryLike, algorithm: HashAlgorithm): string {
    return crypto.createHmac(algorithm, secret).update(data).digest('hex');
}
