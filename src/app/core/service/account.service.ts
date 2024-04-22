import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordChangeRequest } from '../dto/passwordChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  changePassword(request: PasswordChangeRequest): Observable<any> {
    return this.httpClient.post<any>("/user/changePassword", request);
  }
}
