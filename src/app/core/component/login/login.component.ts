import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showLogoEffect = false;
  showLoginForm = true;
  loginForm = this.fb.nonNullable.group({
    email: '',
    password: '',
  });

  constructor(
    private loginService: LoginService, 
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ){
  }

  login(){
    this.showLoginForm = false;
    this.showLogoEffect = true;
    let email = this.loginForm.get('email')!.value;
    let password = this.loginForm.get('password')!.value;

    this.loginService.login(email, password).subscribe({
        next: () => {
          setTimeout(() => {
            this.showLogoEffect = false; // Efekti gizle
            this.router.navigate(["/home/shelf"]);
            this.toastr.success("Hoşgeldiniz")
          }, 800);
        },
        error: (err) => {
          setTimeout(() => { 
            this.showLogoEffect = false;
            this.toastr.error("Email veya şifre hatalı")
            this.showLoginForm = true;
          }, 800);
          console.log(err);
        }
      }
    );
  }
}
