import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetProductResponse } from '../dto/getProductResponse';
import { HttpHeaders } from '@angular/common/http';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { CreateProductRequest } from '../dto/createProductRequest';
import { SaleProductRequest } from '../dto/saleProductRequest';
import { SearchProductRequest } from '../dto/searchProductRequest';
import { DeleteProductRequest } from '../dto/deleteProductRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllProducts():Observable<GetProductResponse> {
    return this.httpClient.get<GetProductResponse>('/product/getall');
  }

  getProductsByPage(request: PaginationRequest): Observable<GetProductResponse> {
    return this.httpClient.post<GetProductResponse>(`/product/getallByPage`, request);
  }

  createProduct(product: CreateProductRequest):Observable<CreateProductRequest> {
    return this.httpClient.post<CreateProductRequest>('/product/create', product, this.httpOptions);
  }

  updateProduct(product: UpdateProductRequest):Observable<UpdateProductRequest>{
    return this.httpClient.put<UpdateProductRequest>('/product/update', product, this.httpOptions);
  }

  deleteProduct(product: DeleteProductRequest):Observable<DeleteProductRequest> {
    return this.httpClient.post<DeleteProductRequest>('/product/delete', product, this.httpOptions);
  }

  saleProduct(saleRequest: SaleProductRequest):Observable<any> {
    return this.httpClient.post<any>('/product/sale', saleRequest);
  }
  
  search(keyword: SearchProductRequest): Observable<GetProductResponse> {
    return this.httpClient.post<GetProductResponse>(`/product/search`, keyword );
  }
}
