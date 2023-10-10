export class PayloadBuildPaymentUrlDTO {
    vnp_Amount: number;
    vnp_OrderInfo: string;
    vnp_TxnRef: string;
    vnp_ReturnUrl?: string;
    vnp_OrderType?: string;
    vnp_BankCode?: string;
    vnp_Locale?: string;
}
