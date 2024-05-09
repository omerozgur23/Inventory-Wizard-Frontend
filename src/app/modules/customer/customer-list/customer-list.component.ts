import { UpdateCustomerRequest } from '../dto/updateCustomerRequest';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateCustomerRequest } from '../dto/createCustomerRequest';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'customerTableCompanyName', field: 'companyName' },
    { label: 'customerTableCompanyOfficial', field: 'contactName' },
    { label: 'customerTableOfficialEmail', field: 'contactEmail' },
    { label: 'customerTableOfficialPhone', field: 'contactPhone' },
    { label: 'customerTableTaxNumber', field: 'taxNumber' },
    { label: 'customerTableAddress', field: 'address' },
  ];

  tableTitle = "customerTableTitle";
  deleteDialogDescription = 'deleteCustomerDialogDescription';
  id: string = '';
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ) {}

  setSelectedCustomer(customerId: string) {
    this.id = customerId;
  }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    this.customerService.getCustomersByPage(this.currentPage, 18).subscribe({
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

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCustomer();
  }

  getAllCustomer() {
    this.customerService.getAllCustomer().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  openCreateCustomerDialog() {
      if (this.authService.isAdmin()) {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title = 'createCustomerTitle';
    dialog.componentInstance.inputLabels = ['customerTableCompanyName', 'customerTableCompanyOfficial', 'customerTableOfficialEmail', 'customerTableOfficialPhone', 'customerTableTaxNumber', 'customerTableAddress'];
    for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
      dialog.componentInstance.addInput();
    }

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const formValues = dialog.componentInstance.createForm.value.values;
          const companyNameValue = formValues[0].inputValue;
          const contactNameValue = formValues[1].inputValue;
          const contactEmailValue = formValues[2].inputValue;
          const contactPhoneValue = formValues[3].inputValue;
          const taxNumber = formValues[4].inputValue;
          const addressValue = formValues[5].inputValue;
          this.createCustomer(companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, taxNumber, addressValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  else {
    this.genericService.showAuthError("authorizationError");
  }
  }

  createCustomer(companyName: string, contactName: string, contactEmail: string, contactPhone: string, taxNumber: string, address: string) {
    const successCreatedMessage = this.translateService.instant("customerCreatedMessage");
    const customer = new CreateCustomerRequest(companyName, contactName, contactEmail, contactPhone, taxNumber, address);
    this.customerService.createCustomer(customer).subscribe({
      next: (result) => {
        this.toastr.success(successCreatedMessage);
        this.loadCustomer();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    });
  }

  openUpdateCustomerDialog(item: any){
      if (this.authService.isAdmin()) {
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title='updateCustomerTitle';
    dialog.componentInstance.inputLabels=['customerTableCompanyName','customerTableCompanyOfficial','customerTableOfficialEmail','customerTableOfficialPhone', 'customerTableAddress'];
    dialog.componentInstance.values.push(new FormControl(item.companyName));
    dialog.componentInstance.values.push(new FormControl(item.contactName));
    dialog.componentInstance.values.push(new FormControl(item.contactEmail));
    dialog.componentInstance.values.push(new FormControl(item.contactPhone));
    dialog.componentInstance.values.push(new FormControl(item.address));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const companyNameValue =  dialog.componentInstance.updateForm.value.values[0];
        const contactNameValue =  dialog.componentInstance.updateForm.value.values[1];
        const contactEmailValue =  dialog.componentInstance.updateForm.value.values[2];
        const contactPhoneValue =  dialog.componentInstance.updateForm.value.values[3];
        const addressValue =  dialog.componentInstance.updateForm.value.values[4]; 
        this.updateCustomer(item.id, companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, addressValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  else {
    this.genericService.showAuthError("authorizationError");
  }
  }

  updateCustomer(id: string, companyName: string, contactName: string, contactEmail: string, contactPhone: string, address: string){
    const successUpdatedMessage = this.translateService.instant("customerUpdatedMessage");
    const customer = new UpdateCustomerRequest(id, companyName, contactName, contactEmail, contactPhone, address);
    this.customerService.updateCustomer(customer).subscribe({
      next: (result) => {
        this.toastr.success(successUpdatedMessage);
        this.loadCustomer();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    })
  }

  deleteCustomer(id: any){
      if (this.authService.isAdmin()) {
    const successDeletedMessage = this.translateService.instant("customerDeletedMessage");
    this.customerService.deleteCustomer(id).subscribe(
      {
        next: (result) =>{
          this.toastr.success(successDeletedMessage)
          this.loadCustomer();
        },
        error: (err) => {
          console.log(err);
          this.genericService.showError("errorMessage");
        }
      }
    );
  }
  else {
    this.genericService.showAuthError("authorizationError");
  }
  }

  generatePDF() {
    const fileName = 'customers.pdf';
    const tableTitle = this.translateService.instant("customerPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.customerService.search(searchKeyword).subscribe({
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
      this.loadCustomer();
    }
  }
}
