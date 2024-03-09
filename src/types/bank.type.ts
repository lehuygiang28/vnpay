export type Bank = {
    /**
     * Mã ngân hàng
     *
     * @en Bank code
     */
    bank_code: string;

    /**
     * Tên ngân hàng
     *
     * @en Bank name
     */
    bank_name: string;

    /**
     * Đường dẫn logo của ngân hàng
     *
     * @en Logo link
     */
    logo_link: string;

    bank_type: number;
    display_order: number;
};
