export class Product {
    constructor(
        public id: string,
        public productName: string,
        public categoryName: string,
        public supplierCompanyName: string,
        public purchasePrice: number,
        public unitPrice:number,
        public quantity: number,
    ){}
}