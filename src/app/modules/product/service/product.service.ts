import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../../category/dto/category';
import { Product } from '../dto/product';
import { Supplier } from '../../supplier/dto/supplier';
import { HttpHeaders } from '@angular/common/http';

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

  updateProduct(update: any): Observable<any>{
    return this.httpClient.post<any>('/product/update', update);
  }

  getProducts():Observable<Product[]> {
    return this.httpClient.get<Product[]>('/product/getallByPage');
  }

  getAllProductsByPage(pageNo: number, pageSize: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`/product/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }
  

  deleteProduct(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/product/delete', JSON.stringify(id), { headers });
  }
}
