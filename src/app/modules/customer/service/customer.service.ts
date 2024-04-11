import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateCustomerDTO } from '../dto/updateCustomerDTO';
import { CreateCustomerRequest } from '../dto/createCustomerDTO';

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

  getAllCustomersByPage(pageNo: number, pageSize: number): Observable<UpdateCustomerDTO[]> {
    return this.httpClient.get<UpdateCustomerDTO[]>(`/customer/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  deleteData(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/customer/delete', JSON.stringify(id), { headers });
  }

  // createCustomer(customerData: any): Observable<any> {
  //   return this.httpClient.post<any>(`/customer/create`, customerData);
  // }
  createCustomer(companyName: string, contactName: string, email: string, contactPhone: string, taxNumber: string, address: string): Observable<any> {
    const request = new CreateCustomerRequest(companyName, contactName, email, contactPhone, taxNumber, address);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>('/customer/create', request, { headers });
  }

  updateCustomer(customer: UpdateCustomerDTO):Observable<any>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put<any>('/customer/update', customer, { headers });
  }
}
