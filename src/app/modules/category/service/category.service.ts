import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCategoryResponse } from '../dto/getCategoryResponse';
import { Observable } from 'rxjs';
import { CreateCategoryRequest } from '../dto/createCategoryRequest';
import { UpdateCategoryRequest } from '../dto/updateCategoryRequest';
import { DeleteCategoryRequest } from '../dto/deleteCategoryRequest';
import { SearchCategoryRequest } from '../dto/searchCategoryRequest';
import { PaginationRequest } from '../dto/paginationRequest';


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

  getCategoriesByPage(request: PaginationRequest): Observable<GetCategoryResponse> {
    return this.httpClient.post<GetCategoryResponse>(`/category/getallByPage`, request);
  }

  createCategory(category: CreateCategoryRequest): Observable<CreateCategoryRequest> {
    return this.httpClient.post<CreateCategoryRequest>('/category/create', category, this.httpOptions);
  }

  updateCategory(category: UpdateCategoryRequest): Observable<UpdateCategoryRequest> {
    return this.httpClient.put<UpdateCategoryRequest>('/category/update', category, this.httpOptions);
  }

  deleteCategory(category: DeleteCategoryRequest):Observable<DeleteCategoryRequest> {
    return this.httpClient.post<DeleteCategoryRequest>('/category/delete', category, this.httpOptions);
  }

  search(keyword: SearchCategoryRequest): Observable<GetCategoryResponse> {
    return this.httpClient.post<GetCategoryResponse>(`/category/search`, keyword);
  }
}
