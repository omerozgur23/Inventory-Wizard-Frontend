export class UpdateSupplierRequest {
    constructor(
        public id: string,
        public companyName: string,
        public contactName: string,
        public contactEmail: string,
        public contactPhone: string,
        public address: string,
    ){}
}