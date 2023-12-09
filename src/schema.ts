import { z } from 'zod';
import { VnpCurrCode, VnpLocale, VnpOrderType } from './enums';

const commonSchema = z.object({
    vnp_Amount: z.number().min(1).max(Number.MAX_SAFE_INTEGER),
    vnp_OrderInfo: z.string().min(1).max(255),
    vnp_TxnRef: z.string().min(1).max(100),
});

export const ConfigVnpaySchema = z.object({
    paymentGateway: z.string().url().min(1).optional(),
    tmnCode: z.string().min(1),
    secureSecret: z.string().min(1),
    returnUrl: z.string().url().min(1).optional(),
    vnp_Version: z.string().min(1).max(8).optional(),
    vnp_CurrCode: z.nativeEnum(VnpCurrCode).optional(),
    vnp_Locale: z.nativeEnum(VnpLocale).optional(),
    vnp_OrderType: z.union([z.string(), z.nativeEnum(VnpOrderType)]).optional(),
});

export const BuildPaymentUrlSchema = commonSchema.extend({
    vnp_Version: z.string().min(1).max(8).optional(),
    vnp_Command: z.string().min(1).max(16).optional(),
    vnp_TmnCode: z.string().min(1).max(8).optional(),
    vnp_BankCode: z.string().min(1).max(20).optional(),
    vnp_CreateDate: z.number().min(10000000000000).max(Number.MAX_SAFE_INTEGER).optional(),
    vnp_CurrCode: z.nativeEnum(VnpCurrCode).optional(),
    vnp_IpAddr: z.string().min(1).max(45).optional(),
    vnp_Locale: z.nativeEnum(VnpLocale).optional(),
    vnp_OrderType: z.string().min(1).max(100).optional(),
    vnp_ReturnUrl: z.string().url().max(255).optional(),
    vnp_SecretKey: z.string().optional(),
});

export const ReturnQueryFromVNPaySchema = commonSchema.extend({
    vnp_TmnCode: z.string().min(1).max(8).optional(),
    vnp_BankCode: z.string().min(3).max(20).optional(),
    vnp_BankTranNo: z.string().min(1).max(255).optional(),
    vnp_CardType: z.string().min(2).max(20).optional(),
    vnp_PayDate: z.union([z.number(), z.string()]).optional(),
    vnp_TransactionNo: z.union([z.number(), z.string()]).optional(),
    vnp_ResponseCode: z.union([z.string(), z.number()]).optional(),
    vnp_TransactionStatus: z.union([z.string(), z.number()]).optional(),
    vnp_SecureHashType: z.string().optional(),
    vnp_SecureHash: z.string().min(1).optional(),
});

export const VerifyReturnUrlSchema = ReturnQueryFromVNPaySchema.extend({
    isSuccess: z.boolean().default(false),
    message: z.string().default('').optional(),
});

export type ConfigVnpaySchema = z.infer<typeof ConfigVnpaySchema>;
export type BuildPaymentUrlSchema = z.infer<typeof BuildPaymentUrlSchema>;
export type ReturnQueryFromVNPaySchema = z.infer<typeof ReturnQueryFromVNPaySchema>;
export type VerifyReturnUrlSchema = z.infer<typeof VerifyReturnUrlSchema>;
