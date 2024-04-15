import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetEmployeeResponse } from '../dto/getEmployeeResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateEmployeeRequest } from '../dto/createEmployeeRequest';
import { UpdateEmployeeRequest } from '../dto/updateEmployeeRequest';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEmployee():Observable<GetEmployeeResponse[]> {
    return this.httpClient.get<GetEmployeeResponse[]>('/user/getall');
  }

  getAllEmployeesByPage(pageNo: number, pageSize: number): Observable<GetEmployeeResponse[]> {
    return this.httpClient.get<GetEmployeeResponse[]>(`/user/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createEmployee(employee: CreateEmployeeRequest):Observable<CreateEmployeeRequest>{
    return this.httpClient.post<CreateEmployeeRequest>('/user/create', employee, this.httpOptions)
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

  updateEmployee(employee: UpdateEmployeeRequest):Observable<UpdateEmployeeRequest>{
    return this.httpClient.put<UpdateEmployeeRequest>('/user/update', employee, this.httpOptions)
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

  deleteEmployee(id: string):Observable<any>{
    return this.httpClient.post('/user/delete', JSON.stringify(id), this.httpOptions)
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
