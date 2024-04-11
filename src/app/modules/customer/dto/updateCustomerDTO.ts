export class UpdateCustomerDTO {
    constructor(
        public id: string,
        public companyName: string,
        public contactName: string,
        public email: string,
        public contactPhone: string,
        public address: string,
    ){}
    
}