import { HashAlgorithm } from '../../../src/enums';
import { hash } from '../../../src/utils';
import {
    calculateQueryDrResponseHash,
    calculateRefundResponseHash,
} from '../../__helpers__/hash-helpers';

describe('hash-helpers', () => {
    it('calculateQueryDrResponseHash should produce expected hash string', () => {
        const tmnCode = 'TMN123';
        const secureSecret = 'secret';
        const response = {
            vnp_ResponseId: 'RID',
            vnp_Command: 'querydr',
            vnp_ResponseCode: '00',
            vnp_Message: 'Success',
            vnp_TxnRef: 'TXN',
            vnp_Amount: 1000000,
            vnp_BankCode: 'NCB',
            vnp_PayDate: '20240101120000',
            vnp_TransactionNo: '999',
            vnp_TransactionType: '01',
            vnp_TransactionStatus: '00',
            vnp_OrderInfo: 'order',
            vnp_PromotionCode: 'PROMO',
            vnp_PromotionAmount: 12345,
        };

        const expectedString = [
            response.vnp_ResponseId,
            response.vnp_Command,
            response.vnp_ResponseCode,
            response.vnp_Message,
            tmnCode,
            response.vnp_TxnRef,
            response.vnp_Amount,
            response.vnp_BankCode,
            response.vnp_PayDate,
            response.vnp_TransactionNo,
            response.vnp_TransactionType,
            response.vnp_TransactionStatus,
            response.vnp_OrderInfo,
            response.vnp_PromotionCode,
            response.vnp_PromotionAmount,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');
        const expected = hash(
            secureSecret,
            Buffer.from(expectedString, 'utf-8'),
            HashAlgorithm.SHA512,
        );

        const actual = calculateQueryDrResponseHash(
            response,
            tmnCode,
            secureSecret,
            HashAlgorithm.SHA512,
        );
        expect(actual).toBe(expected);
    });

    it('calculateRefundResponseHash branches: number vs string amount', () => {
        const secureSecret = 'secret';
        const base = {
            vnp_ResponseId: 'RID',
            vnp_Command: 'refund',
            vnp_ResponseCode: '00',
            vnp_Message: 'Success',
            vnp_TmnCode: 'TMN',
            vnp_TxnRef: 'TXN',
            vnp_BankCode: 'NCB',
            vnp_PayDate: '20240101120000',
            vnp_TransactionNo: '999',
            vnp_TransactionType: '02',
            vnp_TransactionStatus: '00',
            vnp_OrderInfo: 'order',
        };

        // number amount branch (divided by 100)
        const respNumber = { ...base, vnp_Amount: 1000000 };
        const expectedStringNumber = [
            respNumber.vnp_ResponseId,
            respNumber.vnp_Command,
            respNumber.vnp_ResponseCode,
            respNumber.vnp_Message,
            respNumber.vnp_TmnCode,
            respNumber.vnp_TxnRef,
            respNumber.vnp_Amount / 100,
            respNumber.vnp_BankCode,
            respNumber.vnp_PayDate,
            respNumber.vnp_TransactionNo,
            respNumber.vnp_TransactionType,
            respNumber.vnp_TransactionStatus,
            respNumber.vnp_OrderInfo,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');
        const expectedNumber = hash(
            secureSecret,
            Buffer.from(expectedStringNumber, 'utf-8'),
            HashAlgorithm.SHA512,
        );
        const actualNumber = calculateRefundResponseHash(
            respNumber,
            secureSecret,
            HashAlgorithm.SHA512,
        );
        expect(actualNumber).toBe(expectedNumber);

        // string amount branch (unchanged)
        const respString = { ...base, vnp_Amount: '10000' };
        const expectedStringString = [
            respString.vnp_ResponseId,
            respString.vnp_Command,
            respString.vnp_ResponseCode,
            respString.vnp_Message,
            respString.vnp_TmnCode,
            respString.vnp_TxnRef,
            respString.vnp_Amount,
            respString.vnp_BankCode,
            respString.vnp_PayDate,
            respString.vnp_TransactionNo,
            respString.vnp_TransactionType,
            respString.vnp_TransactionStatus,
            respString.vnp_OrderInfo,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');
        const expectedStringHash = hash(
            secureSecret,
            Buffer.from(expectedStringString, 'utf-8'),
            HashAlgorithm.SHA512,
        );
        const actualString = calculateRefundResponseHash(
            respString,
            secureSecret,
            HashAlgorithm.SHA512,
        );
        expect(actualString).toBe(expectedStringHash);
    });

    it('calculateQueryDrResponseHash handles undefined optional fields (strip "undefined")', () => {
        const tmnCode = 'TMN123';
        const secureSecret = 'secret';
        const response = {
            vnp_ResponseId: 'RID',
            vnp_Command: 'querydr',
            vnp_ResponseCode: '00',
            vnp_Message: 'Success',
            vnp_TxnRef: 'TXN',
            vnp_Amount: 1000000,
            vnp_BankCode: 'NCB',
            vnp_PayDate: '20240101120000',
            vnp_TransactionNo: '999',
            vnp_TransactionType: '01',
            vnp_TransactionStatus: '00',
            vnp_OrderInfo: 'order',
            // vnp_PromotionCode and vnp_PromotionAmount intentionally undefined
        } as any;
        // Should not throw and should equal manually computed hash without the word 'undefined'
        const expectedString = [
            response.vnp_ResponseId,
            response.vnp_Command,
            response.vnp_ResponseCode,
            response.vnp_Message,
            tmnCode,
            response.vnp_TxnRef,
            response.vnp_Amount,
            response.vnp_BankCode,
            response.vnp_PayDate,
            response.vnp_TransactionNo,
            response.vnp_TransactionType,
            response.vnp_TransactionStatus,
            response.vnp_OrderInfo,
            response.vnp_PromotionCode,
            response.vnp_PromotionAmount,
        ]
            .map(String)
            .join('|')
            .replace(/undefined/g, '');
        const expected = hash(
            secureSecret,
            Buffer.from(expectedString, 'utf-8'),
            HashAlgorithm.SHA512,
        );
        const actual = calculateQueryDrResponseHash(
            response,
            tmnCode,
            secureSecret,
            HashAlgorithm.SHA512,
        );
        expect(actual).toBe(expected);
    });
});
