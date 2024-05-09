import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetOrderResponse } from '../dto/getOrderResponse';
import { GetOrderDetailsResponse } from '../dto/getOrderDetailsResponse';

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
  
  getOrdersByPage(pageNo: number, pageSize: number): Observable<GetOrderResponse> {
    return this.httpClient.get<GetOrderResponse>(`/orders/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  getOrderDetails(orderId: string, pageNo: number, pageSize: number): Observable<GetOrderDetailsResponse>{
    const params = { orderId: orderId, pageNo: pageNo, pageSize: pageSize };
    return this.httpClient.get<GetOrderDetailsResponse>('/orderDetails/getByOrderId', { params });
  }

  search(keyword: string): Observable<GetOrderResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetOrderResponse[]>(`/orders/search`, { params: params });
  }

}
