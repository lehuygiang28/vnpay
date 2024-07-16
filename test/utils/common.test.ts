import { HashAlgorithm, VnpLocale } from '../../src/enums';
import {
    dateFormat,
    generateRandomString,
    getDateInGMT7,
    getResponseByStatusCode,
    hash,
    isValidVnpayDateFormat,
    parseDate,
    resolveUrlString,
} from '../../src/utils/common';

describe('Common utils', () => {
    let utcDate: Date;
    beforeAll(() => {
        utcDate = new Date(Date.UTC(2023, 11, 21, 10, 30, 0));
    });

    describe('getDateInGMT7', () => {
        it('should return the correct date in GMT+7', () => {
            const date = utcDate;
            const gmt7Date = getDateInGMT7(date);
            expect(gmt7Date.getHours()).toBe(17);
        });
    });

    describe('dateFormat', () => {
        it('should format the date to the correct format', () => {
            const date = utcDate;
            const formattedDate = dateFormat(date);
            expect(formattedDate).toBe(20231221173000);
        });
    });

    describe('parseDate', () => {
        it('should parse the date number to the correct date', () => {
            const dateNumber = 20231221103000;
            const parsedDate = parseDate(dateNumber, 'utc');
            expect(parsedDate).toEqual(utcDate);
        });

        it('should parse the date string to the correct date', () => {
            const dateString = '20231221103000';
            const parsedDate = parseDate(dateString, 'utc');
            expect(parsedDate).toEqual(utcDate);
        });
    });

    describe('isValidVnpayDateFormat', () => {
        it('should return true for valid date', () => {
            const date = 20231221103000;
            expect(isValidVnpayDateFormat(date)).toBe(true);
        });

        it('should return false for invalid date', () => {
            const date = 20231232103000;
            expect(isValidVnpayDateFormat(date)).toBe(false);
        });
    });

    describe('generateRandomString', () => {
        it('should generate a random string with the correct length', () => {
            const length = 10;
            const randomString = generateRandomString(length);
            expect(randomString.length).toBe(length);
        });

        it('should generate a random string with only numbers', () => {
            const length = 10;
            const randomString = generateRandomString(length, { onlyNumber: true });
            expect(randomString).toMatch(/^\d+$/);
        });
    });

    describe('getResponseByStatusCode', () => {
        it('should return the correct response message', () => {
            const responseCode = '00';
            const locale = VnpLocale.VN;
            const responseMessage = getResponseByStatusCode(responseCode, locale);
            expect(responseMessage).toBe('Giao dịch thành công');
        });

        it('should return the correct response message for default response code', () => {
            const responseCode = '99';
            const locale = VnpLocale.VN;
            const responseMessage = getResponseByStatusCode(responseCode, locale);
            expect(responseMessage).toBe('Giao dịch thất bại');
        });

        it('should return the default response message', () => {
            const responseMessage = getResponseByStatusCode();
            expect(responseMessage).toBe('Giao dịch thất bại');
        });
    });

    describe('resolveUrlString', () => {
        it('should resolve url string correctly', () => {
            expect(resolveUrlString('https://example.com/', '/path')).toBe(
                'https://example.com/path',
            );
            expect(resolveUrlString('https://example.com', '/path')).toBe(
                'https://example.com/path',
            );
            expect(resolveUrlString('https://example.com/', 'path')).toBe(
                'https://example.com/path',
            );
            expect(resolveUrlString('https://example.com', 'path')).toBe(
                'https://example.com/path',
            );
            expect(resolveUrlString('https://example.com///', '///path')).toBe(
                'https://example.com/path',
            );
        });
    });

    describe('hash', () => {
        it('should hash data correctly', () => {
            const secret = 'secret';
            const data = 'data';
            const algorithm = HashAlgorithm.SHA512;
            const hashedData = hash(secret, data, algorithm);
            expect(hashedData).toBe(
                '6274071d33dec2728a2a1c903697fc1210b3252221c3d137e12d9f1ae5c8ed53e05e692b05a9eefff289667e2387c0fc0bd8a3d9bd7000782730c856a77a77d5',
            );
        });
    });
});
