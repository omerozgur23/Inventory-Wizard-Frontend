import { ProductItemDTO } from "./ProductItemDTO";

export interface SaleProductRequest {
    customerId: string;
    userId: string;
    productItems: ProductItemDTO[];
}