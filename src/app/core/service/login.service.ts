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
  //kullanicilarId = "";
  roller: string[] = [];

  constructor(
    private httpClient: HttpClient,
  ) { }


  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>('/login', {email, password}).pipe(
      map(data => this.parseLoginResponse(data, email, password))
    );
  }

  // signup(email: string, password: string): Observable<any> {
  //   return this.httpClient.post<any>('/signup', {email, password}).pipe(
  //     map(data => this.parseLoginResponse(data, email, password))
  //   );
  // }

  // login olunursa çalışıyor
  parseLoginResponse(data: any, email: string, password: string){
    this.loggedIn = true;
        this.token = data.token;
        this.email = email;
        this.password = password;
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        let payload = this.parseJwt(this.token);
        this.roller = payload.roller;
        //this.kullanicilarId = payload.kullanicilarId;
        return data;
  }

  reLogin(): Observable<any>{
    return this.login(this.email, this.password);
  }

  logout() {
    this.loggedIn = false;
    this.token = "";
    this.email = "";
    this.password = "";
    //this.kullanicilarId = "";
    this.roller = [];
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
    this.roller.forEach(rol => {
      if(rol === roleAdi){
        hasRole = true;
      }
    })
    return hasRole;
  }
}