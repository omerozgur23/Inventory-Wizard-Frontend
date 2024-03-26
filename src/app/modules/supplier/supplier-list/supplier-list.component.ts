import { Component } from '@angular/core';
import { Supplier } from '../dto/supplier';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../service/supplier.service';
import { TableColumn } from '../../../shared/components/table/dto/table';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent {
  // supplierList: Supplier[] = [];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Company Name', field: 'companyName' },
    { label: 'Firma Yetkilisi', field: 'contactName' },
    { label: 'Yetkili Telefon', field: 'contactPhone' },
    { label: 'Vergi No', field: 'taxNumber' },
    { label: 'Adres', field: 'address' },
  ];

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.getSupplier();
  }

  getSupplier() {
    this.supplierService.getSupplier().subscribe((customers: any[]) => {
      this.tableData = customers;
    });
  }

  // ngOnInit(): void {
  //   this.supplierService.getSupplier().subscribe({
  //     next: (resp) => {
  //       this.supplierList = resp;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }

  navigateCreate(){
    this.router.navigate(['./supplier-create'], { relativeTo: this.route });
  }

  deleteSupplier(id: any) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: (resp) => {
        this.toastr.success("Tedarikçi silinmiştir.")
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu!")
      }
    })
  }
}
