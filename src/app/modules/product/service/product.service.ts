import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../../category/dto/category';
import { Product } from '../dto/product';
import { Supplier } from '../../supplier/dto/supplier';
import { HttpHeaders } from '@angular/common/http';
import { UpdateProductDTO } from '../dto/updateProductDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  createProduct(create: any):Observable<any> {
    return this.httpClient.post<any>('/product/create', create);
  }

  getProducts():Observable<Product[]> {
    return this.httpClient.get<Product[]>('/product/getall');
  }

  getAllProductsByPage(pageNo: number, pageSize: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`/product/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  saleProduct(sale: any):Observable<any> {
    return this.httpClient.post<any>('/product/sale', sale);
  }
  
  deleteProduct(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/product/delete', JSON.stringify(id), { headers });
  }

  updateProduct(product: UpdateProductDTO):Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put<any>('/product/update', product, { headers })
  }

  search(name: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/product/getByProductNameStartsWith', { params: { productName: name } });
  }
  
}
