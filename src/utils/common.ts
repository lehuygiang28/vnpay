import { RESPONSE_MAP } from '../constants/response-map.constant';
import { HashAlgorithm, VnpLocale } from '../enums';
import crypto, { BinaryLike } from 'crypto';

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

export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
