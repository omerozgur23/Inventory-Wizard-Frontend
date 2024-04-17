import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

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
      this.password = localStorage.getItem('password') || '';
      this.roles = JSON.parse(localStorage.getItem('roles') || '[]');
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>('/login', {email, password}).pipe(
      map(data => this.parseLoginResponse(data, email, password))
    );
  }
  
  // login olunursa çalışıyor
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
        localStorage.setItem("password", this.password);
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
    localStorage.clear();
  } 

  parseJwt (token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  userHasRole(roleAdi: string): boolean{
    let hasRole = false;
    this.roles.forEach(rol => {
      if(rol === roleAdi){
        hasRole = true;
      }
    })
    return hasRole;
  }

  

  // loggedIn = false;
  // token = '';
  // email = '';
  // password = '';
  // roles: string[] = [];

  // constructor(private httpClient: HttpClient) {
  //   this.loadSessionData();
  // }

  // private loadSessionData(): void {
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     this.token = storedToken;
  //     this.loggedIn = true;
  //     this.email = localStorage.getItem('email') || '';
  //     this.password = localStorage.getItem('password') || '';
  //     const storedRoles = localStorage.getItem('roles');
  //     if (storedRoles) {
  //       try {
  //         this.roles = JSON.parse(storedRoles); // localStorage'dan rolleri JSON formatında al
  //       } catch (error) {
  //         console.error('Error parsing roles from localStorage:', error);
  //         this.roles = []; // Hata durumunda boş dizi ataması yapabilirsiniz
  //       }
  //     } else {
  //       this.roles = []; // localStorage'da roller bulunamazsa boş dizi ataması yapabilirsiniz
  //     }
  //   }
  // }
  

  // login(email: string, password: string): Observable<any> {
  //   return this.httpClient.post<any>('/login', { email, password }).pipe(
  //     map(data => this.handleLoginResponse(data, email, password)),
  //     catchError(this.handleError)
  //   );
  // }

  // private handleLoginResponse(data: any, email: string, password: string): any {
  //   if (data && data.token) {
  //     this.loggedIn = true;
  //     this.token = data.token;
  //     this.email = email;
  //     this.password = password;
  //     const payload = this.parseJwt(this.token);
  //     this.roles = payload.roles;
  //     this.saveSessionData();
  //   }
  //   return data;
  // }

  // private saveSessionData(): void {
  //   localStorage.setItem('token', this.token);
  //   localStorage.setItem('email', this.email);
  //   localStorage.setItem('password', this.password);
  //   localStorage.setItem('roles', JSON.stringify(this.roles));
  // }

  // reLogin(): Observable<any> {
  //   if (this.loggedIn) {
  //     return this.login(this.email, this.password);
  //   } else {
  //     return throwError('User is not logged in');
  //   }
  // }

  // logout(): void {
  //   this.loggedIn = false;
  //   this.token = '';
  //   this.email = '';
  //   this.password = '';
  //   this.roles = [];
  //   localStorage.clear();
  // }

  // private parseJwt(token: string): any {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );
  //   return JSON.parse(jsonPayload);
  // }

  // private handleError(error: HttpErrorResponse): Observable<never> {
  //   console.error('Login error:', error);
  //   let errorMessage = 'An error occurred during login';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Client-side error: ${error.error.message}`;
  //   } else {
  //     errorMessage = `Server-side error: ${error.status} - ${error.error.message}`;
  //   }
  //   return throwError(errorMessage);
  // }

  // userHasRole(roleName: string): boolean {
  //   return this.loggedIn && this.roles.includes(roleName);
  // }
}