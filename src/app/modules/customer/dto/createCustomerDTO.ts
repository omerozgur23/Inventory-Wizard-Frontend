export class CreateCustomerRequest {
    constructor(
        public companyName: string,
        public contactName: string,
        public email: string,
        public contactPhone: string,
        public taxNumber: string,
        public address: string,
    ) {}
  }
  