import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { GetShelfResponse } from '../dto/getShelfResponse';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { AcceptProductRequest } from '../dto/acceptProductRequest';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllShelves():Observable<GetShelfResponse> {
    return this.httpClient.get<GetShelfResponse>('/shelf/getall');
  }

  getShelvesByPage(pageNo: number, pageSize: number): Observable<GetShelfResponse> {
    return this.httpClient.get<GetShelfResponse>(`/shelf/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createShelf(shelf: CreateShelfRequest):Observable<CreateShelfRequest> {
    return this.httpClient.post<CreateShelfRequest>('/shelf/create', shelf, this.httpOptions);
  }

  updateShelf(shelf: UpdateShelfRequest): Observable<any> {
    return this.httpClient.put<any>('/shelf/update', shelf, this.httpOptions)
  }
  
  deleteShelf(id: string):Observable<any> {
    return this.httpClient.post('/shelf/delete', JSON.stringify(id), this.httpOptions);
  }

  acceptProduct(request: AcceptProductRequest):Observable<AcceptProductRequest> {
    return this.httpClient.post<AcceptProductRequest>('/product/accept', request);
  }

  search(keyword: string): Observable<GetShelfResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetShelfResponse[]>(`/shelf/search`, { params: params });
  }
}
