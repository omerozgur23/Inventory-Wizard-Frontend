export interface GetInvoiceDetailResponse {
    count: number,
    data: [
        {
            id: string,
            invoiceId: string,
            productName: string,
            quantity: number,
            unitPrice: number,
            totalPrice: number,
        }
    ]
}