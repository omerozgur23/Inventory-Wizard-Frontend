export interface GetSupplierResponse{
    count: number,
    data: [
        {
            id: string;
            companyName: string;
            contactName: string;
            contactEmail: string,
            contactPhone: string;
            taxNumber: string;
            address: string;
        }
    ]
}