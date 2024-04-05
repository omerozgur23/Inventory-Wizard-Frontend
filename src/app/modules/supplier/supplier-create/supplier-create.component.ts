import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../service/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrl: './supplier-create.component.scss'
})
export class SupplierCreateComponent {

  supplierForm = this.fb.group({
    companyName: '',
    contactName: '',
    contactPhone: '',
    taxNumber: '',
    address: '',
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  submit() {
    this.supplierService.createSupplier(this.supplierForm.value ).subscribe({
      next: (resp) => {
        this.toastr.success('Tedarikçi Oluşturulmuştur');
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }
}
