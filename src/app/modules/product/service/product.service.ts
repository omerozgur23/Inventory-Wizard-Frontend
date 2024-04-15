import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GetCategoryResponse } from '../../category/dto/getCategoryResponse';
import { GetProductResponse } from '../dto/getProductResponse';
import { GetSupplierResponse } from '../../supplier/dto/getSupplierResponse';
import { HttpHeaders } from '@angular/common/http';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { CreateProductRequest } from '../dto/createProductRequest';

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

  getAllProducts():Observable<GetProductResponse[]> {
    return this.httpClient.get<GetProductResponse[]>('/product/getall');
  }

  getProductsByPage(pageNo: number, pageSize: number): Observable<GetProductResponse[]> {
    return this.httpClient.get<GetProductResponse[]>(`/product/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createProduct(product: CreateProductRequest):Observable<CreateProductRequest> {
    return this.httpClient.post<CreateProductRequest>('/product/create', product, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }

  updateProduct(product: UpdateProductRequest):Observable<UpdateProductRequest>{
    return this.httpClient.put<UpdateProductRequest>('/product/update', product, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }

  deleteProduct(id: string):Observable<any> {
    return this.httpClient.post('/product/delete', JSON.stringify(id), this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }

  saleProduct(sale: any):Observable<any> {
    return this.httpClient.post<any>('/product/sale', sale)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }
  
  search(name: string): Observable<GetProductResponse[]> {
    return this.httpClient.get<GetProductResponse[]>('/product/getByProductNameStartsWith', { params: { productName: name } });
  }
}
