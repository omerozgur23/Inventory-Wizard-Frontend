import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetSupplierResponse } from '../dto/getSupplierResponse';
import { UpdateSupplierRequest } from '../dto/updateSupplierRequest';
import { CreateSupplierRequest } from '../dto/createSupplierRequest';
import { SearchSupplierRequest } from '../dto/searchSupplierRequest';
import { DeleteSupplierRequest } from '../dto/deleteSupplierRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

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

  getSuppliersByPage(request: PaginationRequest): Observable<GetSupplierResponse> {
    return this.httpClient.post<GetSupplierResponse>(`/supplier/getallByPage`, request);
  }

  createSupplier(supplier: CreateSupplierRequest):Observable<CreateSupplierRequest> {
    return this.httpClient.post<CreateSupplierRequest>('/supplier/create', supplier, this.httpOptions);
  }

  updateSupplier(supplier: UpdateSupplierRequest): Observable<UpdateSupplierRequest> {
    return this.httpClient.put<UpdateSupplierRequest>('/supplier/update', supplier, this.httpOptions);
  }

  deleteSupplier(supplier: DeleteSupplierRequest):Observable<DeleteSupplierRequest> {
    return this.httpClient.post<DeleteSupplierRequest>('/supplier/delete', supplier, this.httpOptions);
  }

  search(keyword: SearchSupplierRequest): Observable<GetSupplierResponse> {
    return this.httpClient.post<GetSupplierResponse>(`/supplier/search`, keyword );
  }
}
