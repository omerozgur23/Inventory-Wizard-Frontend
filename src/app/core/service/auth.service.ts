import { ROLE_REPORTER } from './../../shared/model/constants';
import { Injectable } from '@angular/core';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from '../../shared/model/constants';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private loginService: LoginService,
  ) { }

  getLoggedInUserEmail(): string {
    const userEmail = localStorage.getItem('email') || '';
    return userEmail;
  }

  isAdmin(): boolean {
    return this.loginService.roles.includes(ROLE_ADMIN);
  }
  
  isWarehouseSupervisor(): boolean {
    return this.loginService.roles.includes(ROLE_EMPLOYEE);
  }

  isReporter(): boolean {
    return this.loginService.roles.includes(ROLE_REPORTER);
  }
}
