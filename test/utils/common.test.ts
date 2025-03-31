import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
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

// Setup plugins
dayjs.extend(utc);
dayjs.extend(timezone);

describe('Common utils', () => {
    let utcDate: Date;
    beforeAll(() => {
        utcDate = dayjs.utc('2023-12-21T10:30:00Z').toDate();
    });

    describe('getDateInGMT7', () => {
        it('should return the correct date in GMT+7', () => {
            const date = utcDate;
            const gmt7Date = getDateInGMT7(date);
            expect(gmt7Date.getHours()).toBe(17);
        });

        it('should return the correct date in GMT+7 from GMT+2', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-12-21T10:30:00+02:00'));
            expect(gmt7Date.getHours()).toBe(15);
        });

        it('should return the correct date in GMT+7 from GMT+5', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-12-21T10:30:00+05:00'));
            expect(gmt7Date.getHours()).toBe(12);
        });

        it('should return the correct date in GMT+7 from GMT+6', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-12-21T23:30:00+06:00'));
            expect(gmt7Date.getHours()).toBe(0);
            expect(gmt7Date.getDate()).toBe(22);
        });

        it('should return the correct date in GMT+7 from GMT-5 (US Eastern)', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-12-21T08:00:00-05:00'));
            expect(gmt7Date.getHours()).toBe(20);
            expect(gmt7Date.getDate()).toBe(21);
        });

        it('should return the correct date in GMT+7 from GMT-8 (US Pacific)', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-12-21T23:00:00-08:00'));
            expect(gmt7Date.getHours()).toBe(14);
            expect(gmt7Date.getDate()).toBe(22);
        });

        it('should handle month change correctly when converting to GMT+7', () => {
            const gmt7Date = getDateInGMT7(new Date('2023-01-31T23:00:00Z'));
            expect(gmt7Date.getHours()).toBe(6);
            expect(gmt7Date.getDate()).toBe(1);
            expect(gmt7Date.getMonth()).toBe(1); // February (0-indexed)
        });

        it('should handle year change correctly when converting to GMT+7', () => {
            const gmt7Date = getDateInGMT7(new Date('2022-12-31T22:00:00Z'));
            expect(gmt7Date.getHours()).toBe(5);
            expect(gmt7Date.getDate()).toBe(1);
            expect(gmt7Date.getMonth()).toBe(0); // January (0-indexed)
            expect(gmt7Date.getFullYear()).toBe(2023);
        });
    });

    describe('dateFormat', () => {
        it('should format the date to the correct format', () => {
            const date = utcDate;
            const formattedDate = dateFormat(date);
            expect(formattedDate).toBe(20231221103000);
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

        it('should parse the date string to the correct date with gmt7', () => {
            // Because this test runs in the UTC timezone,
            // the expected date must add 7 hours when parsing the date with the 'gmt7' option.
            const utcClone = new Date(utcDate);
            const expected = new Date(utcClone.setHours(utcClone.getHours() + 7));

            const dateString = '20231221103000';
            const parsedDate = parseDate(dateString, 'gmt7');
            expect(parsedDate).toEqual(expected);
        });

        it('should parse the date string to the correct date without timezone', () => {
            const dateString = '20231221103000';
            const parsedDate = parseDate(dateString);
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
