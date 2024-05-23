import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateCustomerRequest } from '../dto/updateCustomerRequest';
import { CreateCustomerRequest } from '../dto/createCustomerRequest';
import { GetCustomerResponse } from '../dto/getCustomerResponse';
import { SearchCustomerRequest } from '../dto/searchCustomerRequest';
import { DeleteCustomerRequest } from '../dto/deleteCustomerRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

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

  getCustomersByPage(request: PaginationRequest): Observable<GetCustomerResponse> {
    return this.httpClient.post<GetCustomerResponse>(`/customer/getallByPage`, request);
  }
  
  createCustomer(customer: CreateCustomerRequest): Observable<CreateCustomerRequest> {
    return this.httpClient.post<any>('/customer/create', customer, this.httpOptions);
  }

  updateCustomer(customer: UpdateCustomerRequest):Observable<UpdateCustomerRequest>{
    return this.httpClient.put<any>('/customer/update', customer, this.httpOptions);
  }
  
  deleteCustomer(customer: DeleteCustomerRequest):Observable<DeleteCustomerRequest> {
    return this.httpClient.post<DeleteCustomerRequest>('/customer/delete', customer, this.httpOptions);
  }

  search(keyword: SearchCustomerRequest): Observable<GetCustomerResponse> {
    return this.httpClient.post<GetCustomerResponse>(`/customer/search`, keyword);
  }
}
