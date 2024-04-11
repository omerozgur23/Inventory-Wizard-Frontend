import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../dto/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEmployee():Observable<Employee[]> {
    return this.httpClient.get<Employee[]>('/user/getall');
  }

  getAllEmployeesByPage(pageNo: number, pageSize: number): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`/user/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  deleteEmployee(id: string):Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/user/delete', JSON.stringify(id), { headers });
  }

  updateEmployee(employee: Employee):Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put<any>('/user/update', employee, {headers})
  }
}
