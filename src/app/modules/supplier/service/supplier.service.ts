import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../dto/supplier';
import { UpdateSupplierDTO } from '../dto/updateSupplierDTO';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getSupplier(): Observable<Supplier[]>{
    return this.httpClient.get<Supplier[]>('/supplier/getall');
  }

  getAllSuppliersByPage(pageNo: number, pageSize: number): Observable<Supplier[]> {
    return this.httpClient.get<Supplier[]>(`/supplier/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createSupplier(create: any):Observable<any> {
    return this.httpClient.post<any>('/supplier/create', create);
  }

  deleteSupplier(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/supplier/delete', JSON.stringify(id), { headers });
  }

  update(supplier: UpdateSupplierDTO): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put<any>('/supplier/update', supplier, { headers })
  }

}
