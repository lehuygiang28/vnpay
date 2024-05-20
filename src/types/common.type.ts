import { ProductCode, VnpCurrCode, VnpLocale } from '../enums';
import { VNPayConfig } from './vnpay-config.type';

export type GlobalConfig = Omit<VNPayConfig, 'testMode' | 'enableLog' | 'loggerFn'> & {
    vnpayHost: string;
    vnp_Locale: VnpLocale;
    vnp_CurrCode: VnpCurrCode;
    vnp_Command: string;
    vnp_OrderType: ProductCode | string;
    vnp_Version: string;
};

export type DefaultConfig = Pick<
    GlobalConfig,
    'vnp_Version' | 'vnp_CurrCode' | 'vnp_Command' | 'vnp_OrderType'
> & {
    vnp_TmnCode: string;
    vnp_Locale: VnpLocale;
};

export type OmitFields<ObjectToDo, Fields extends keyof ObjectToDo> = {
    type: 'omit';
    fields: Fields[];
    loggerFn?: (data: Omit<ObjectToDo, Fields>) => void;
};

export type PickFields<ObjectToDo, Fields extends keyof ObjectToDo> = {
    type: 'pick';
    fields: Fields[];
    loggerFn?: (data: Pick<ObjectToDo, Fields>) => void;
};

export type AllFields<ObjectToDo> = {
    type?: 'all';
    loggerFn?: (data: ObjectToDo) => void;
};
