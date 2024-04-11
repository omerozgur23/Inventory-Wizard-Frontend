export class UpdateProductDTO {
    constructor(
        public id: string,
        /*public categoryId: string,
        public supplierId: string,*/
        public productName: string,
        public purchasePrice: number,
        public unitPrice:number,
    ){}
}