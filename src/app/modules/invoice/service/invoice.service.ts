import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetInvoiceResponse } from '../dto/getInvoiceResponse';
import { GetInvoiceDetailResponse } from '../dto/getInvoiceDetailResponse';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getInvoicesByPage(pageNo: number, pageSize: number): Observable<GetInvoiceResponse> {
    return this.httpClient.get<GetInvoiceResponse>(`/invoice/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  getInvoiceDetail(invoiceId: string, pageNo: number, pageSize: number): Observable<GetInvoiceDetailResponse>{
    const params = { invoiceId: invoiceId, pageNo: pageNo, pageSize: pageSize };
    return this.httpClient.get<GetInvoiceDetailResponse>('/invoiceDetail/getByInvoiceId', { params });
  }

  createInvoice(id: string):Observable<any> {
    return this.httpClient.post('/invoice/create', JSON.stringify(id), this.httpOptions);
  }

  invoiceCancellation(id: string):Observable<any> {
    return this.httpClient.post('/invoice/cancellation', JSON.stringify(id), this.httpOptions);
  }

  search(keyword: string): Observable<GetInvoiceResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetInvoiceResponse[]>(`/invoice/search`, { params: params });
  }
}
