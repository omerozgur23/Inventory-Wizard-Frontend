import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../service/supplier.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { UpdateSupplierRequest } from '../dto/updateSupplierRequest';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateSupplierRequest } from '../dto/createSupplierRequest';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/service/auth.service';
import { SearchSupplierRequest } from '../dto/searchSupplierRequest';
import { DeleteSupplierRequest } from '../dto/deleteSupplierRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { Validators } from '@angular/forms';

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
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
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
    this.supplierService.getSuppliersByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
      next: (result) => {
        this.tableData = result.data;
        this.totalShelvesCount = result.count;
        this.totalPages = Math.ceil(this.totalShelvesCount / this.itemPerPage) 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateSupplierDialog(){
    if (this.authService.isAdmin()) {
      let dialog = this.dialog.open(CreateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms,'
      });

      dialog.componentInstance.title = 'createSupplierTitle';
      dialog.componentInstance.inputLabels = ['supplierTableCompanyName', 'supplierTableCompanyOfficial', 'supplierTableOfficialEmail', 'supplierTableOfficialPhone', 'supplierTableTaxNumber', 'supplierTableAddress'];
      for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
        dialog.componentInstance.addInput();
      }

      dialog.afterClosed().subscribe({
        next: (data) => {
          if(data?.result === 'yes') {
            const formValues = dialog.componentInstance.createForm.value.values;
            const companyNameValue = formValues[0].inputValue;
            const contactNameValue = formValues[1].inputValue;
            const contactEmailValue = formValues[2].inputValue;
            const contactPhoneValue = formValues[3].inputValue;
            const taxNumberValue = formValues[4].inputValue;
            const addressValue = formValues[5].inputValue;
            this.createSupplier(companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, taxNumberValue, addressValue);
          }
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  createSupplier(companyName: string, contactName: string, contactEmail: string, contactPhone: string, taxNumber: string, address: string){
    const successCreatedMessage = this.translateService.instant("supplierCreatedMessage");
    const supplier = new CreateSupplierRequest(companyName, contactName, contactEmail, contactPhone, taxNumber, address);
    this.supplierService.createSupplier(supplier).subscribe({
      next: (result) => {
        this.toastr.success(successCreatedMessage);
        this.loadSupplier();
      },
      error: (err) => { 
        console.log(err);
        this.genericService.showError("errorMessage");
      },
    });
  }

  openUpdateSupplierDialog(item: any){
    if (this.authService.isAdmin()) {  
      let dialog =  this.dialog.open(UpdateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title='updateSupplierTitle';
      dialog.componentInstance.inputLabels = ['supplierTableCompanyName', 'supplierTableCompanyOfficial', 'supplierTableOfficialEmail', 'supplierTableOfficialPhone', 'supplierTableAddress'];
      dialog.componentInstance.addInput(item.companyName, [Validators.required]);
      dialog.componentInstance.addInput(item.contactName, [Validators.required]);
      dialog.componentInstance.addInput(item.contactEmail, [Validators.required, Validators.email]);
      dialog.componentInstance.addInput(item.contactPhone, [Validators.required]);
      dialog.componentInstance.addInput(item.address, [Validators.required]);

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
            const companyNameValue = dialog.componentInstance.updateForm.value.values[0].inputValue;
            const contactNameValue = dialog.componentInstance.updateForm.value.values[1].inputValue;
            const contactEmailValue = dialog.componentInstance.updateForm.value.values[2].inputValue;
            const contactPhoneValue = dialog.componentInstance.updateForm.value.values[3].inputValue;
            const addressValue = dialog.componentInstance.updateForm.value.values[4].inputValue;
            this.updateSupplier(item.id, companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, addressValue);
          }
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  updateSupplier(id: string, companyName: string, contactName: string, contactEmail: string, contactPhone: string, address: string){
    const successUpdatedMessage = this.translateService.instant("supplierUpdatedMessage");
    const supplier = new UpdateSupplierRequest(id, companyName, contactName, contactEmail, contactPhone, address);
    this.supplierService.updateSupplier(supplier).subscribe({
      next: (result) => {
        this.toastr.success(successUpdatedMessage);
        this.loadSupplier();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    })
  }

  deleteSupplier(id: any) {
    if (this.authService.isAdmin()) {
      const successDeletedMessage = this.translateService.instant("supplierDeletedMessage");
      const supplier = new DeleteSupplierRequest(id);
      this.supplierService.deleteSupplier(supplier).subscribe({
        next: (result) => {
          this.toastr.success(successDeletedMessage)
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
          this.genericService.showError("errorMessage");
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  generatePDF() {
    const fileName = 'suppliers.pdf';
    const tableTitle = this.translateService.instant("supplierPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      const keyword = new SearchSupplierRequest(searchKeyword);
      setTimeout(() => 
        this.supplierService.search(keyword).subscribe({
          next: (result) => {
            this.tableData = result.data;
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
}
