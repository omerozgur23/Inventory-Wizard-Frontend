import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../dto/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCategory():Observable<Category[]> {
    return this.httpClient.get<Category[]>('/category/getall');
  }

  createCategory(category:any):Observable<any> {
    return this.httpClient.post<Category>('/category/create', category)
  }

  deleteCategory(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/category/delete', JSON.stringify(id), { headers });
  }
}
