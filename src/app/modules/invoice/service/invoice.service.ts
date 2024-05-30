import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetInvoiceResponse } from '../dto/getInvoiceResponse';
import { GetInvoiceDetailResponse } from '../dto/getInvoiceDetailResponse';
import { SearchInvoiceRequest } from '../dto/searchInvoiceRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { CreateInvoiceRequest } from '../dto/createInvoiceRequest';
import { CancellationInvoiceRequest } from '../dto/cancellationInvoiceRequest';

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

  getInvoicesByPage(request: PaginationRequest): Observable<GetInvoiceResponse> {
    return this.httpClient.post<GetInvoiceResponse>(`/invoice/getallByPage`, request);
  }

  getInvoiceDetail(invoiceId: string, pageNo: number, pageSize: number): Observable<GetInvoiceDetailResponse>{
    const params = { invoiceId: invoiceId, pageNo: pageNo, pageSize: pageSize };
    return this.httpClient.get<GetInvoiceDetailResponse>('/invoiceDetail/getByInvoiceId', { params });
  }

  createInvoice(request: CreateInvoiceRequest):Observable<any> {
    return this.httpClient.post('/invoice/create', request, this.httpOptions);
  }

  invoiceCancellation(request: CancellationInvoiceRequest):Observable<any> {
    return this.httpClient.post('/invoice/cancellation', request, this.httpOptions);
  }

  search(keyword: SearchInvoiceRequest): Observable<GetInvoiceResponse> {
    return this.httpClient.post<GetInvoiceResponse>(`/invoice/search`, keyword );
  }
}
