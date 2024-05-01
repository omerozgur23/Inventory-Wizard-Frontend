import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetOrderResponse } from '../../order/dto/getOrderResponse';
import { Observable } from 'rxjs';
import { GetCustomerByOrderCountResponse } from '../dto/getCustomerByOrderCountResponse';
import { GetEmployeeByOrderCountResponse } from '../dto/getEmployeeByOrderCountResponse';
import { GetBestSellingProduct } from '../dto/getBestSellingProducts';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient
  ) { }

  getTotalSales(): Observable<number>{
    return this.httpClient.get<number>("/report/totalsales");
  }

  getTotalSalesCost(): Observable<number>{
    return this.httpClient.get<number>("/report/totalsalescost");
  }

  getWinning(): Observable<number>{
    return this.httpClient.get<number>("/report/winning");
  }

  getLastFiveOrders(): Observable<GetOrderResponse[]>{
    return this.httpClient.get<GetOrderResponse[]>('/report/lastfiveorders');
  }

  getOrdersTheMost(): Observable<GetCustomerByOrderCountResponse[]>{
    return this.httpClient.get<GetCustomerByOrderCountResponse[]>('/report/orderthemost');
  }

  getMostOrderSenders(): Observable<GetEmployeeByOrderCountResponse[]>{
    return this.httpClient.get<GetEmployeeByOrderCountResponse[]>("/report/mostordersenders");
  }

  getBestSellingProducts(): Observable<GetBestSellingProduct[]>{
    return this.httpClient.get<GetBestSellingProduct[]>("/report/bestsellingproducts");
  }
}
