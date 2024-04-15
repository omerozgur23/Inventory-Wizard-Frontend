import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { GetSupplierResponse } from '../dto/getSupplierResponse';
import { UpdateSupplierRequest } from '../dto/updateSupplierRequest';
import { CreateSupplierRequest } from '../dto/createSupplierRequest';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllSupplier(): Observable<GetSupplierResponse[]>{
    return this.httpClient.get<GetSupplierResponse[]>('/supplier/getall');
  }

  getAllSuppliersByPage(pageNo: number, pageSize: number): Observable<GetSupplierResponse[]> {
    return this.httpClient.get<GetSupplierResponse[]>(`/supplier/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createSupplier(supplier: CreateSupplierRequest):Observable<CreateSupplierRequest> {
    return this.httpClient.post<CreateSupplierRequest>('/supplier/create', supplier, this.httpOptions)
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

  update(supplier: UpdateSupplierRequest): Observable<UpdateSupplierRequest> {
    return this.httpClient.put<UpdateSupplierRequest>('/supplier/update', supplier, this.httpOptions)
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

  deleteSupplier(id: string):Observable<any> {
    return this.httpClient.post('/supplier/delete', JSON.stringify(id), this.httpOptions)
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
}
