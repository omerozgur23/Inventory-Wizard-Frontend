import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shelf } from '../dto/shelf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getShelf():Observable<Shelf[]> {
    return this.httpClient.get<Shelf[]>('/shelf/getall');
  }

  acceptProduct(create: any):Observable<any> {
    return this.httpClient.post<any>('/product/accept', create);
  }
  
  createShelf(shelf:any):Observable<any> {
    return this.httpClient.post<Shelf>('/shelf/create', shelf)
  }

  deleteShelf(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/shelf/delete', JSON.stringify(id), { headers });
  }
}
