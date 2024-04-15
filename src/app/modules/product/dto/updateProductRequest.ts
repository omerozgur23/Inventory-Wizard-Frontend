export class UpdateProductRequest {
    constructor(
        public id: string,
        /*public categoryId: string,
        public supplierId: string,*/
        public productName: string,
        public criticalCount: number,
        public purchasePrice: number,
        public unitPrice:number,
    ){}
}