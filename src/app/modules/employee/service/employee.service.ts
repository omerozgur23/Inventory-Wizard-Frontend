import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetEmployeeResponse } from '../dto/getEmployeeResponse';
import { Observable } from 'rxjs';
import { CreateEmployeeRequest } from '../dto/createEmployeeRequest';
import { UpdateEmployeeRequest } from '../dto/updateEmployeeRequest';
import { GetRolesResponse } from '../dto/getRolesResponse';

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

  getAllEmployee():Observable<GetEmployeeResponse> {
    return this.httpClient.get<GetEmployeeResponse>('/user/getall');
  }

  getEmployeesByPage(pageNo: number, pageSize: number): Observable<GetEmployeeResponse> {
    return this.httpClient.get<GetEmployeeResponse>(`/user/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createEmployee(employee: CreateEmployeeRequest):Observable<CreateEmployeeRequest>{
    return this.httpClient.post<CreateEmployeeRequest>('/user/create', employee, this.httpOptions);
  }

  updateEmployee(employee: UpdateEmployeeRequest):Observable<UpdateEmployeeRequest>{
    return this.httpClient.put<UpdateEmployeeRequest>('/user/update', employee, this.httpOptions);
  }

  deleteEmployee(id: string):Observable<any>{
    return this.httpClient.post('/user/delete', JSON.stringify(id), this.httpOptions);
  }

  search(keyword: string): Observable<GetEmployeeResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetEmployeeResponse[]>(`/user/search`, { params: params });
  }

  getAllRoles(): Observable<GetRolesResponse[]>{
    return this.httpClient.get<GetRolesResponse[]>('/user/roles');
  }
}
