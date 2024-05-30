import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetOrderResponse } from '../dto/getOrderResponse';
import { GetOrderDetailsResponse } from '../dto/getOrderDetailsResponse';
import { SearchOrderRequest } from '../dto/searchOrderRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { GetCustomerResponse } from '../../customer/dto/getCustomerResponse';
import { GetOrderByIdRequest } from '../dto/getOrderByIdRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllOrders(): Observable<GetOrderResponse>{
    return this.httpClient.get<GetOrderResponse>('/orders/getall');
  }
  
  getOrdersByPage(request: PaginationRequest): Observable<GetOrderResponse> {
    return this.httpClient.post<GetOrderResponse>(`/orders/getallByPage`, request);
  }

  getOrderDetails(orderId: string, pageNo: number, pageSize: number): Observable<GetOrderDetailsResponse>{
    const params = { orderId: orderId, pageNo: pageNo, pageSize: pageSize };
    return this.httpClient.get<GetOrderDetailsResponse>('/orderDetails/getByOrderId', { params });
  }

  search(keyword: SearchOrderRequest): Observable<GetOrderResponse> {
    return this.httpClient.post<GetOrderResponse>(`/orders/search`, keyword );
  }

  getById(id: GetOrderByIdRequest): Observable<GetCustomerResponse> {
    return this.httpClient.post<GetCustomerResponse>('/orders/getbyid', id);
  }

}
