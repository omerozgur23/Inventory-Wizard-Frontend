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

  deleteEmployee(id: string):Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/user/delete', JSON.stringify(id), { headers });
  }
}
