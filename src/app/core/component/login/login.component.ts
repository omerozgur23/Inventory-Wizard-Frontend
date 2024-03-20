import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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
    let email = this.loginForm.get('email')!.value;
    let password = this.loginForm.get('password')!.value;
    console.log(email, password);
    this.loginService.login(email, password).subscribe({
        next: () => {
          this.toastr.success("Giriş yapıldı")
          this.router.navigate(["/menu"]);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Email veya şifre hatalı")
        }
      }
    );
  }

}
