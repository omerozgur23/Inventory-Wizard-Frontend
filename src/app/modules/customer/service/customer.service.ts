import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCustomers(): Observable<any[]>{
    return this.httpClient.get<any[]>('/customer/getall');
  }

  deleteData(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/customer/delete', JSON.stringify(id), { headers });
  }

  createCustomer(customerData: any): Observable<any> {
    return this.httpClient.post<any>(`/customer/create`, customerData);
  }
}
