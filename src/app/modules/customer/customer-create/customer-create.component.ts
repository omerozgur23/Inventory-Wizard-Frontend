import { Component } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})

export class CustomerCreateComponent {
  customerForm: FormGroup;

  fieldLabels = {
    companyName: 'Firma Ünvanı',
    contactName: 'Firma Yetkilisi',
    email: 'Yetkili E-Mail',
    contactPhone: 'Yetkili Telefon',
    taxNumber: 'Vergi No',
    address: 'Adres'
  };

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.customerForm = this.fb.group({
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', Validators.required],
      contactPhone: ['', Validators.required],
      taxNumber: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  submit() {
    // this.customerService.createCustomer(this.customerForm.value).subscribe({
    //   next: (resp) => {
    //     this.toastr.success('Müşteri Oluşturulmuştur');
    //     this.router.navigate(['..'], {relativeTo: this.route});
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.toastr.error("Hata oluştu");
    //   }
    // });
  }

  back() {
    this.router.navigate(['/']);
  }
}
