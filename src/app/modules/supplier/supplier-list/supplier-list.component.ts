import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../service/supplier.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { FormControl } from '@angular/forms';
import { UpdateSupplierRequest } from '../dto/updateSupplierRequest';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateSupplierRequest } from '../dto/createSupplierRequest';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'supplierTableCompanyName', field: 'companyName' },
    { label: 'supplierTableCompanyOfficial', field: 'contactName' },
    { label: 'supplierTableOfficialEmail', field: 'contactEmail' },
    { label: 'supplierTableOfficialPhone', field: 'contactPhone' },
    { label: 'supplierTableTaxNumber', field: 'taxNumber' },
    { label: 'supplierTableAddress', field: 'address' },
  ];

  tableTitle = "supplierTableTitle";
  deleteDialogDescription = 'deleteSupplierDialogDescription';
  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService,
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
    this.supplierService.getSuppliersByPage(this.currentPage, 18).subscribe({
      next: (result) => {
        this.tableData = result;
        console.log(this.tableData);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateSupplierDialog(){
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms,'
    });

    dialog.componentInstance.title = 'createSupplierTitle';
    dialog.componentInstance.inputLabels = ['supplierTableCompanyName', 'supplierTableCompanyOfficial', 'supplierTableOfficialEmail', 'supplierTableOfficialPhone', 'supplierTableTaxNumber', 'supplierTableAddress'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if(data?.result === 'yes') {
          const companyNameValue = dialog.componentInstance.createForm.value.values[0];
          const contactNameValue = dialog.componentInstance.createForm.value.values[1];
          const contactEmailValue = dialog.componentInstance.createForm.value.values[2];
          const contactPhoneValue = dialog.componentInstance.createForm.value.values[3];
          const taxNumberValue = dialog.componentInstance.createForm.value.values[4];
          const addressValue = dialog.componentInstance.createForm.value.values[5];
          this.createSupplier(companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, taxNumberValue, addressValue);
        }
      }
    });
  }

  createSupplier(companyName: string, contactName: string, contactEmail: string, contactPhone: string, taxNumber: string, address: string){
    const supplier = new CreateSupplierRequest(companyName, contactName, contactEmail, contactPhone, taxNumber, address);
    this.supplierService.createSupplier(supplier).subscribe({
      next: (result) => {
        this.toastr.success('Tedarikçi Kaydı Yapıldı');
        this.loadSupplier();
      },
      error: (err) => { 
        console.log(err);
        this.toastr.error('hata oluştu');
      },
    });
  }

  openUpdateSupplierDialog(item: any){    
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title='updateSupplierTitle';
    dialog.componentInstance.inputLabels = ['supplierTableCompanyName', 'supplierTableCompanyOfficial', 'supplierTableOfficialEmail', 'supplierTableOfficialPhone', 'supplierTableAddress'];
    dialog.componentInstance.values.push(new FormControl(item.companyName));
    dialog.componentInstance.values.push(new FormControl(item.contactName));
    dialog.componentInstance.values.push(new FormControl(item.contactEmail));
    dialog.componentInstance.values.push(new FormControl(item.contactPhone));
    dialog.componentInstance.values.push(new FormControl(item.address));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const companyNameValue = dialog.componentInstance.updateForm.value.values[0];
          const contactNameValue = dialog.componentInstance.updateForm.value.values[1];
          const contactEmailValue = dialog.componentInstance.updateForm.value.values[2];
          const contactPhoneValue = dialog.componentInstance.updateForm.value.values[3];
          const addressValue = dialog.componentInstance.updateForm.value.values[4];
          this.updateSupplier(item.id, companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, addressValue);
        }
      }
    });
  }

  updateSupplier(id: string, companyName: string, contactName: string, contactEmail: string, contactPhone: string, address: string){
    const supplier = new UpdateSupplierRequest(id, companyName, contactName, contactEmail, contactPhone, address);
    this.supplierService.updateSupplier(supplier).subscribe({
      next: (result) => {
        this.toastr.success('Tedarikçi Güncellenmiştir');
        this.loadSupplier();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteSupplier(id: any) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: (result) => {
        this.toastr.success("Tedarikçi silinmiştir.")
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu!")
      }
    })
  }

  generatePDF() {
    const fileName = 'suppliers.pdf';
    const tableTitle = 'Tedarikçi Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.supplierService.search(searchKeyword).subscribe({
          next: (result) => {
            this.tableData = result;
          },
          error: (err) => {
            console.log(err);
          }
        }),
        300
      );
    } else {
      this.loadSupplier();
    }
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
