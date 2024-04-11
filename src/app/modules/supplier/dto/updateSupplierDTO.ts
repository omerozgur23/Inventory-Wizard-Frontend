export class UpdateSupplierDTO {
    constructor(
        public id: string,
        public companyName: string,
        public contactName: string,
        public contactPhone: string,
        // public taxNumber: string,
        public address: string,
    ){}
}