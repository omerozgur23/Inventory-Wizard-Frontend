import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  loggedIn = false;
  token = "";
  email = "";
  password = "";
  roles: string[] = [];

  constructor(
    private httpClient: HttpClient,
  ) {
    this.loadSessionData();
    }

  private loadSessionData(): void{
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
      this.loggedIn = true;
      this.email = localStorage.getItem('email') || '';
      this.roles = JSON.parse(localStorage.getItem('roles') || '[]');
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>('/login', {email, password}).pipe(
      map(data => this.parseLoginResponse(data, email, password))
    );
  }
  
  parseLoginResponse(data: any, email: string, password: string){
    this.loggedIn = true;
        this.token = data.token;
        this.email = email;
        this.password = password;
        let payload = this.parseJwt(this.token);
        this.roles = payload.roles;
        this.saveSessionData();
        return data;
  }

  saveSessionData(): void {
    localStorage.setItem("token", this.token);
        localStorage.setItem("email", this.email);
        localStorage.setItem('roles', JSON.stringify(this.roles));
  }

  reLogin(): Observable<any>{
    return this.login(this.email, this.password);
  }

  logout() {
    this.loggedIn = false;
    this.token = "";
    this.email = "";
    this.password = "";
    this.roles = [];
    for (let key in localStorage) {
      if (key !== 'lang') {
        localStorage.removeItem(key);
      }
    }
  }

  parseJwt (token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  userHasRole(roleName: string): boolean{
    let hasRole = false;
    this.roles.forEach(rol => {
      if(rol === roleName){
        hasRole = true;
      }
    })
    return hasRole;
  }
}