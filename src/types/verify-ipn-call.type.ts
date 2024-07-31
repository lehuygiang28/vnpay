import type { LoggerData, LoggerOptions } from './logger.type';
import type { VerifyReturnUrl } from './verify-return-url.type';

export type VerifyIpnCall = VerifyReturnUrl;

export type VerifyIpnCallLogger = LoggerData<
    {
        createdAt: Date;
    } & VerifyIpnCall
>;

export type VerifyIpnCallOptions<Fields extends keyof VerifyIpnCallLogger> = {
    withHash?: boolean;
} & LoggerOptions<VerifyIpnCallLogger, Fields>;
