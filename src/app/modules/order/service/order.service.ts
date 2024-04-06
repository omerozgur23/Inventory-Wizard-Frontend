import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getOrders(): Observable<any[]>{
    return this.httpClient.get<any[]>('/order/getall');
  }

}
