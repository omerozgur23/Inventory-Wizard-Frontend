import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService,
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
            this.showLogoEffect = false;
            this.router.navigate(["/home/shelf"]);
            const welcomeMessage = this.translateService.instant('loginSuccessMessage');
            this.toastr.success(welcomeMessage)
          }, 800);
        },
        error: (err) => {
          setTimeout(() => { 
            this.showLogoEffect = false;
            this.showErrorMessage('loginErrorMessage')
            this.showLoginForm = true;
          }, 800);
          console.log(err);
        }
      }
    );
  }

  showErrorMessage(messageKey: string) {
    const errorMessage = this.translateService.instant(messageKey);
    this.toastr.error(errorMessage);
  }
}
