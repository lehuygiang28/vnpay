/**
 * The response must to be sent to VNPAY after receiving the IPN request
 */
export type IpnResponse = {
    RspCode: string;
    Message: string;
};

export const IpnSuccess: IpnResponse = {
    RspCode: '00',
    Message: 'Confirm Success',
};

export const IpnOrderNotFound: IpnResponse = {
    RspCode: '01',
    Message: 'Order not found',
};

export const InpOrderAlreadyConfirmed: IpnResponse = {
    RspCode: '02',
    Message: 'Order already confirmed',
};

export const IpnIpProhibited: IpnResponse = {
    RspCode: '03',
    Message: 'IP prohibited',
};

export const IpnInvalidAmount: IpnResponse = {
    RspCode: '04',
    Message: 'Invalid amount',
};

export const IpnFailChecksum: IpnResponse = {
    RspCode: '97',
    Message: 'Fail checksum',
};

export const IpnUnknownError: IpnResponse = {
    RspCode: '99',
    Message: 'Unknown error',
};
