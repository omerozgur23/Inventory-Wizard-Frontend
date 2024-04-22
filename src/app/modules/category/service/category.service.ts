import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetCategoryResponse } from '../dto/getCategoryResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateCategoryRequest } from '../dto/createCategoryRequest';
import { UpdateCategoryRequest } from '../dto/updateCategoryRequest';
import { ToastrService } from 'ngx-toastr';


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

  getAllCategory():Observable<GetCategoryResponse[]> {
    return this.httpClient.get<GetCategoryResponse[]>('/category/getall');
  }

  getAllCategoriesByPage(pageNo: number, pageSize: number): Observable<GetCategoryResponse[]> {
    return this.httpClient.get<GetCategoryResponse[]>(`/category/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createCategory(category: CreateCategoryRequest): Observable<CreateCategoryRequest> {
    return this.httpClient.post<CreateCategoryRequest>('/category/create', category, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }

  updateCategory(category: UpdateCategoryRequest): Observable<UpdateCategoryRequest> {
    return this.httpClient.put<UpdateCategoryRequest>('/category/update', category, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }

  deleteCategory(id: string):Observable<any> {
    return this.httpClient.post('/category/delete', JSON.stringify(id), this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          errorMessage = `Hata: ${error.error.message}`;
        } else {
          // Sunucu tarafında hata
          errorMessage = `Sunucu Hatası: ${error.status}, ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage); // Hata durumunu tekrar fırlat
      })
    );
  }
}
