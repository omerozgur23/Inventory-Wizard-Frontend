export class CreateProductRequest{
    constructor(
        public productName: string,
        public categoryId: string,
        public supplierId: string,
        public criticalCount: number,
        public purchasePrice: number,
        public unitPrice: number,
    ){}
}