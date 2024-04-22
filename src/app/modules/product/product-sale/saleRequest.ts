import { SaleProductDTO } from "./saleProductDTO";

export interface SaleRequest {
    customerId: string;
    userId: string;
    productItems: SaleProductDTO[];
    // orderDate?: string;
}