import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateCustomerRequest } from '../dto/updateCustomerRequest';
import { CreateCustomerRequest } from '../dto/createCustomerRequest';
import { GetCustomerResponse } from '../dto/getCustomerResponse';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCustomers(): Observable<GetCustomerResponse[]>{
    return this.httpClient.get<GetCustomerResponse[]>('/customer/getall');
  }

  getAllCustomersByPage(pageNo: number, pageSize: number): Observable<GetCustomerResponse[]> {
    return this.httpClient.get<GetCustomerResponse[]>(`/customer/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }
  
  createCustomer(customer: CreateCustomerRequest): Observable<CreateCustomerRequest> {
    return this.httpClient.post<any>('/customer/create', customer, this.httpOptions)
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

  updateCustomer(customer: UpdateCustomerRequest):Observable<UpdateCustomerRequest>{
    return this.httpClient.put<any>('/customer/update', customer, this.httpOptions)
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
  
  deleteData(id: string):Observable<any> {
    return this.httpClient.post('/customer/delete', JSON.stringify(id), this.httpOptions)
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
