import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCategoryResponse } from '../dto/getCategoryResponse';
import { Observable } from 'rxjs';
import { CreateCategoryRequest } from '../dto/createCategoryRequest';
import { UpdateCategoryRequest } from '../dto/updateCategoryRequest';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private httpClient: HttpClient,
  ) {}

  getAllCategory():Observable<GetCategoryResponse> {
    return this.httpClient.get<GetCategoryResponse>('/category/getall');
  }

  getCategoriesByPage(pageNo: number, pageSize: number): Observable<GetCategoryResponse> {
    return this.httpClient.get<GetCategoryResponse>(`/category/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createCategory(category: CreateCategoryRequest): Observable<CreateCategoryRequest> {
    return this.httpClient.post<CreateCategoryRequest>('/category/create', category, this.httpOptions);
  }

  updateCategory(category: UpdateCategoryRequest): Observable<UpdateCategoryRequest> {
    return this.httpClient.put<UpdateCategoryRequest>('/category/update', category, this.httpOptions);
  }

  deleteCategory(id: string):Observable<any> {
    return this.httpClient.post('/category/delete', JSON.stringify(id), this.httpOptions);
  }

  search(keyword: string): Observable<GetCategoryResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.httpClient.get<GetCategoryResponse[]>(`/category/search`, { params: params });
  }
}
