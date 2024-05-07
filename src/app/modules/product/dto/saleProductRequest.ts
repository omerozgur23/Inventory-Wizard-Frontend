import { ProductItemDTO } from "./productItemDTO";

export interface SaleProductRequest {
    customerId: string;
    userId: string;
    productItems: ProductItemDTO[];
}