import { HttpClient } from '@angular/common/http';
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
}
