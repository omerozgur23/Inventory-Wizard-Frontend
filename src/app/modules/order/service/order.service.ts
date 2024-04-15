import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
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

  getAllOrders(): Observable<GetOrderResponse[]>{
    return this.httpClient.get<GetOrderResponse[]>('/orders/getall');
  }
  
  getAllOrdersByPage(pageNo: number, pageSize: number): Observable<GetOrderResponse[]> {
    return this.httpClient.get<GetOrderResponse[]>(`/orders/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  getOrderDetails(orderId: string): Observable<GetOrderDetailsResponse[]>{
    const params = { orderId: orderId };
    return this.httpClient.get<GetOrderDetailsResponse[]>('/orderDetails/getByOrderId', { params }).pipe(
      catchError((error: any) => {
        console.error('Error fetching order details:', error);
        throw error; // Hata yeniden fırlatılabilir veya uygun şekilde işlenebilir
      })
    );
  }

}
