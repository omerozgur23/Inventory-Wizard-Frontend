import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { GetShelfResponse } from '../dto/getShelfResponse';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { AcceptProductRequest } from '../dto/acceptProductRequest';
import { SearchShelfRequest } from '../dto/searchShelfRequest';
import { DeleteShelfRequest } from '../dto/deleteShelfRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

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

  getShelvesByPage(request: PaginationRequest): Observable<GetShelfResponse> {
    return this.httpClient.post<GetShelfResponse>(`/shelf/getallByPage`, request);
  }

  createShelf(shelf: CreateShelfRequest):Observable<CreateShelfRequest> {
    return this.httpClient.post<CreateShelfRequest>('/shelf/create', shelf, this.httpOptions);
  }

  updateShelf(shelf: UpdateShelfRequest): Observable<any> {
    return this.httpClient.put<any>('/shelf/update', shelf, this.httpOptions)
  }
  
  deleteShelf(shelf: DeleteShelfRequest):Observable<DeleteShelfRequest> {
    return this.httpClient.post<DeleteShelfRequest>('/shelf/delete', shelf, this.httpOptions);
  }

  acceptProduct(request: AcceptProductRequest):Observable<AcceptProductRequest> {
    return this.httpClient.post<AcceptProductRequest>('/product/accept', request);
  }

  search(keyword: SearchShelfRequest): Observable<GetShelfResponse> {
    return this.httpClient.post<GetShelfResponse>(`/shelf/search`, keyword );
  }
}
