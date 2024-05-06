export interface GetProductResponse {
    count: number,
    data: [
        {
            id: string,
            productName: string,
            categoryName: string,
            supplierCompanyName: string,
            purchasePrice: number,
            criticalQuantity: number,
            unitPrice: number,
            quantity: number,
        }
    ]
}