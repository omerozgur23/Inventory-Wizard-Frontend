import { Component } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {

  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Company Name', field: 'companyName' },
    { label: 'Firma Yetkilisi', field: 'contactName' },
    { label: 'Yetkili E-Mail', field: 'email' },
    { label: 'Yetkili Telefon', field: 'contactPhone' },
    { label: 'Vergi No', field: 'taxNumber' },
    { label: 'Adres', field: 'address' },
  ];

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  navigateCreate(){
    this.router.navigate(['./customer-create'], { relativeTo: this.route });
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe((customers: any[]) => {
      this.tableData = customers;
    });
  }

  deleteCustomer(id: any){
    this.customerService.deleteData(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Müşteri silinmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }
}
