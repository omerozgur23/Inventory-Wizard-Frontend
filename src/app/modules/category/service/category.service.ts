import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../dto/category';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateCategory } from '../dto/UpdateCategoryRequest';
import { CreateCategoryRequest } from '../dto/createCategoryDTO';

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

  getAllCategoriesByPage(pageNo: number, pageSize: number): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`/category/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createCategory(categoryName: string): Observable<any> {
    const request = new CreateCategoryRequest(categoryName); // CreateCategoryRequest nesnesini oluştur
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>('/category/create', request, { headers });
  }

  updateCategory(id: string, categoryName: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put<any>('/category/update', {id,categoryName}, { headers })
  }

  deleteCategory(id: string):Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post('/category/delete', JSON.stringify(id), { headers });
  }
}
