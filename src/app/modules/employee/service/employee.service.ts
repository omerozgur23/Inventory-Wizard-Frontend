import { HttpClient } from '@angular/common/http';
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
}
