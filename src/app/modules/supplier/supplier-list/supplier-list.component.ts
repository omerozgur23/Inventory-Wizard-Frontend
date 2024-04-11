import { Component } from '@angular/core';
import { Supplier } from '../dto/supplier';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../service/supplier.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { UpdateSupplierDTO } from '../dto/updateSupplierDTO';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Firma Ünvanı', field: 'companyName' },
    { label: 'Firma Yetkilisi', field: 'contactName' },
    { label: 'Yetkili Telefon', field: 'contactPhone' },
    { label: 'Vergi No', field: 'taxNumber' },
    { label: 'Adres', field: 'address' },
  ];

  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ){}

  setSelectedSupplier(supplierId: string) {
    this.id = supplierId;
  }

  ngOnInit(): void {
    this.loadSupplier();
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadSupplier();
  }

  loadSupplier() {
    this.supplierService.getAllSuppliersByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  getSupplier() {
    this.supplierService.getSupplier().subscribe((customers: any[]) => {
      this.tableData = customers;
    });
  }

  navigateCreate(){
    this.router.navigate(['./create'], { relativeTo: this.route });
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

  updateSupplier(id: string, companyName: string, contactName: string, contactPhone: string, address: string){
    const supplier = new UpdateSupplierDTO(id, companyName, contactName, contactPhone, address);
    this.supplierService.update(supplier).subscribe({
      next: (resp) => {
        this.toastr.success('Tedarikçi Güncellenmiştir');
        this.loadSupplier();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  update(item: any){    
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const companyNameValue = dialog.componentInstance.updateForm.value.values[0];
          const contactNameValue = dialog.componentInstance.updateForm.value.values[1];
          const contactPhoneValue = dialog.componentInstance.updateForm.value.values[2];
          const addressValue = dialog.componentInstance.updateForm.value.values[3];
          this.updateSupplier(item.id, companyNameValue, contactNameValue, contactPhoneValue, addressValue);
        }
      }
    });
    dialog.componentInstance.title='Tedarikçi Güncelle';
    dialog.componentInstance.inputLabels = ['Firma Ünvanı', 'Firma Yetkilisi', 'Yetkili Telefon', 'Adres'];
    dialog.componentInstance.values.push(new FormControl(item.companyName));
    dialog.componentInstance.values.push(new FormControl(item.contactName));
    dialog.componentInstance.values.push(new FormControl(item.contactPhone));
    dialog.componentInstance.values.push(new FormControl(item.address));
  }
}
