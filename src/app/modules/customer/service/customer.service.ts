import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getAllCustomer(): Observable<GetCustomerResponse>{
    return this.httpClient.get<GetCustomerResponse>('/customer/getall');
  }

  getCustomersByPage(pageNo: number, pageSize: number): Observable<GetCustomerResponse> {
    return this.httpClient.get<GetCustomerResponse>(`/customer/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }
  
  createCustomer(customer: CreateCustomerRequest): Observable<CreateCustomerRequest> {
    return this.httpClient.post<any>('/customer/create', customer, this.httpOptions);
  }

  updateCustomer(customer: UpdateCustomerRequest):Observable<UpdateCustomerRequest>{
    return this.httpClient.put<any>('/customer/update', customer, this.httpOptions);
  }
  
  deleteCustomer(id: string):Observable<any> {
    return this.httpClient.post('/customer/delete', JSON.stringify(id), this.httpOptions);
  }

  search(keyword: string): Observable<GetCustomerResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetCustomerResponse[]>(`/customer/search`, { params: params });
  }
}
