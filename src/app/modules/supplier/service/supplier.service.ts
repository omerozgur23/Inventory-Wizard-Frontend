import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetSupplierResponse } from '../dto/getSupplierResponse';
import { UpdateSupplierRequest } from '../dto/updateSupplierRequest';
import { CreateSupplierRequest } from '../dto/createSupplierRequest';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllSuppliers(): Observable<GetSupplierResponse>{
    return this.httpClient.get<GetSupplierResponse>('/supplier/getall');
  }

  getSuppliersByPage(pageNo: number, pageSize: number): Observable<GetSupplierResponse> {
    return this.httpClient.get<GetSupplierResponse>(`/supplier/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createSupplier(supplier: CreateSupplierRequest):Observable<CreateSupplierRequest> {
    return this.httpClient.post<CreateSupplierRequest>('/supplier/create', supplier, this.httpOptions);
  }

  updateSupplier(supplier: UpdateSupplierRequest): Observable<UpdateSupplierRequest> {
    return this.httpClient.put<UpdateSupplierRequest>('/supplier/update', supplier, this.httpOptions);
  }

  deleteSupplier(id: string):Observable<any> {
    return this.httpClient.post('/supplier/delete', JSON.stringify(id), this.httpOptions);
  }

  search(keyword: string): Observable<GetSupplierResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetSupplierResponse[]>(`/supplier/search`, { params: params });
  }
}
