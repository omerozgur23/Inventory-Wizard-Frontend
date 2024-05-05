import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetProductResponse } from '../dto/getProductResponse';
import { HttpHeaders } from '@angular/common/http';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { CreateProductRequest } from '../dto/createProductRequest';
import { SaleProductRequest } from '../dto/saleProductRequest';

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

  getProductsByPage(pageNo: number, pageSize: number): Observable<GetProductResponse> {
    return this.httpClient.get<GetProductResponse>(`/product/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createProduct(product: CreateProductRequest):Observable<CreateProductRequest> {
    return this.httpClient.post<CreateProductRequest>('/product/create', product, this.httpOptions);
  }

  updateProduct(product: UpdateProductRequest):Observable<UpdateProductRequest>{
    return this.httpClient.put<UpdateProductRequest>('/product/update', product, this.httpOptions);
  }

  deleteProduct(id: string):Observable<any> {
    return this.httpClient.post('/product/delete', JSON.stringify(id), this.httpOptions);
  }

  saleProduct(saleRequest: SaleProductRequest):Observable<any> {
    return this.httpClient.post<any>('/product/sale', saleRequest);
  }
  
  search(keyword: string): Observable<GetProductResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetProductResponse[]>(`/product/search`, { params: params });
  }
}
