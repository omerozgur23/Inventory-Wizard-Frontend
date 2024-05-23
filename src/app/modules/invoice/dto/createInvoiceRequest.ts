import { ProductItemDTO } from "../../product/dto/productItemDTO";

export interface CreateInvoiceRequest {
    orderId: string;
    productItems: ProductItemDTO[];
}