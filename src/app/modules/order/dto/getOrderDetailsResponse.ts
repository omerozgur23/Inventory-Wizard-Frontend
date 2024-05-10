export interface GetOrderDetailsResponse {
    count: number,
    data: [
        {
            id: string,
            orderId: string,
            productName: string,
            quantity: number,
            unitPrice: number,
            totalPrice: number,
        }
    ]
}