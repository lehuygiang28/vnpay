import { ReturnQueryFromVNPayDTO } from './return-query-from-vnpay.dto';

export class VerifyReturnUrlDTO extends ReturnQueryFromVNPayDTO {
    constructor(data: VerifyReturnUrlDTO) {
        super(data);
        this.isSuccess = data.isSuccess ?? false;
        this.message = data.message ?? '';
    }

    /**
     * @vi_vn Trạng thái giao dịch
     */
    isSuccess: boolean;

    /**
     * @vi_vn Thông báo lỗi
     */
    message: string;
}
