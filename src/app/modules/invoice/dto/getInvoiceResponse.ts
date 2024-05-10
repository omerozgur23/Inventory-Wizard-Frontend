export interface GetInvoiceResponse {
    count: number,
    data: [
        {
            id: string,
            customerCompanyName: string,
            totalAmount: number,
            waybillDate: Date,
            status: boolean,
        }
    ]
}