import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../service/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  accountForm = this.fb.nonNullable.group({
    email: { value: this.loginService.email, disabled: true },
    lastPassword: ['', Validators.required],
    password: ["", [ Validators.required, Validators.minLength(3), /*Validators.pattern(/Admin/) *//*, yasakliIsimKontrolu */] ],
    password2: "",
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private accountService: AccountService,
    private toastr: ToastrService,
  ) {}

  submit() {
    let lastPassword = this.accountForm.get('lastPassword')!.value;
    let newPassword = this.accountForm.get('password')!.value;
    
    this.accountService.changePassword({lastPassword, newPassword }).subscribe({
      next: (sonuc) => {
        console.log(sonuc);
        this.toastr.info("Şifre değiştirilmiştir.");
        this.accountForm.reset({
          lastPassword: "",
          password: "",
          password2: "",
        })
      },
      error: (error) => {
        if (error.status === 400) {
          this.accountForm.get('lastPassword')!.setErrors({ incorrectPassword: true });
        } else {
          this.toastr.error("Şifre değiştirme işlemi başarısız oldu.");
        }
      }
    });
  }

  checkPasswordMatch() {
    const password = this.accountForm.get('password')!.value;
    const password2 = this.accountForm.get('password2')!.value;
    if (password !== password2) {
      this.accountForm.get('password2')!.setErrors({ passwordMismatch: true });
    } else {
      this.accountForm.get('password2')!.setErrors(null);
    }
  }
}
