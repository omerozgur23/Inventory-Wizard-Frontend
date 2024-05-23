import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetEmployeeResponse } from '../dto/getEmployeeResponse';
import { Observable } from 'rxjs';
import { CreateEmployeeRequest } from '../dto/createEmployeeRequest';
import { UpdateEmployeeRequest } from '../dto/updateEmployeeRequest';
import { GetRolesResponse } from '../dto/getRolesResponse';
import { SearchEmployeeRequest } from '../dto/searchEmployeeRequest';
import { DeleteEmployeeRequest } from '../dto/deleteEmployeeRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

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

  getEmployeesByPage(request: PaginationRequest): Observable<GetEmployeeResponse> {
    return this.httpClient.post<GetEmployeeResponse>(`/user/getallByPage`, request);
  }

  createEmployee(employee: CreateEmployeeRequest):Observable<CreateEmployeeRequest>{
    return this.httpClient.post<CreateEmployeeRequest>('/user/create', employee, this.httpOptions);
  }

  updateEmployee(employee: UpdateEmployeeRequest):Observable<UpdateEmployeeRequest>{
    return this.httpClient.put<UpdateEmployeeRequest>('/user/update', employee, this.httpOptions);
  }

  deleteEmployee(employee: DeleteEmployeeRequest):Observable<DeleteEmployeeRequest>{
    return this.httpClient.post<DeleteEmployeeRequest>('/user/delete', employee, this.httpOptions);
  }

  search(keyword: SearchEmployeeRequest): Observable<GetEmployeeResponse> {
    return this.httpClient.post<GetEmployeeResponse>(`/user/search`, keyword);
  }

  getAllRoles(): Observable<GetRolesResponse[]>{
    return this.httpClient.get<GetRolesResponse[]>('/user/roles');
  }
}
