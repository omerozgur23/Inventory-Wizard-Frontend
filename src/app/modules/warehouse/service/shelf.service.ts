import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { GetShelfResponse } from '../dto/getShelfResponse';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  getAllShelf():Observable<GetShelfResponse[]> {
    return this.httpClient.get<GetShelfResponse[]>('/shelf/getall');
  }

  getShelvesByPage(pageNo: number, pageSize: number): Observable<GetShelfResponse[]> {
    return this.httpClient.get<GetShelfResponse[]>(`/shelf/getallByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
  }

  createShelf(shelf: CreateShelfRequest):Observable<CreateShelfRequest> {
    return this.httpClient.post<GetShelfResponse>('/shelf/create', shelf, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bir hata oluştu';
        if (error.error instanceof ErrorEvent) {
          // İstemci tarafında hata
          if (shelf.count > 1) {
            this.toastr.info('Tek seferde maksimum 1 raf oluşturulabilir!');
          }
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

  updateShelf(/*id: string, capacity: number*/ shelf: UpdateShelfRequest): Observable<any> {
    return this.httpClient.put<any>('/shelf/update', shelf, this.httpOptions)
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
  
  deleteShelf(id: string):Observable<any> {
    return this.httpClient.post('/shelf/delete', JSON.stringify(id), this.httpOptions)
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

  acceptProduct(create: any):Observable<any> {
    return this.httpClient.post<any>('/product/accept', create);
  }
}
