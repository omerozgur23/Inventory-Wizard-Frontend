export interface GetOrderResponse {
    count: number,
    data: [
        {
            id: string,
            customerCompanyName: string,
            employeeFirstName: string,
            orderDate: Date,
            invoiceGenerated: boolean,
        }
    ]
}