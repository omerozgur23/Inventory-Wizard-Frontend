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
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private genericService: GenericService,
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
        this.tableData = result;
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
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  openCreateCustomerDialog() {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title = 'createCustomerTitle';
    dialog.componentInstance.inputLabels = ['customerTableCompanyName', 'customerTableCompanyOfficial', 'customerTableOfficialEmail', 'customerTableOfficialPhone', 'customerTableTaxNumber', 'customerTableAddress'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const companyNameValue = dialog.componentInstance.createForm.value.values[0];
          const contactNameValue = dialog.componentInstance.createForm.value.values[1];
          const contactEmailValue = dialog.componentInstance.createForm.value.values[2];
          const contactPhoneValue = dialog.componentInstance.createForm.value.values[3];
          const taxNumber = dialog.componentInstance.createForm.value.values[4];
          const addressValue = dialog.componentInstance.createForm.value.values[5];
          this.createCustomer(companyNameValue, contactNameValue, contactEmailValue, contactPhoneValue, taxNumber, addressValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createCustomer(companyName: string, contactName: string, contactEmail: string, contactPhone: string, taxNumber: string, address: string) {
    const customer = new CreateCustomerRequest(companyName, contactName, contactEmail, contactPhone, taxNumber, address);
    this.customerService.createCustomer(customer).subscribe({
      next: (result) => {
        this.toastr.success('Müşteri Oluşturuldu');
        this.loadCustomer();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }

  openUpdateCustomerDialog(item: any){
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

  updateCustomer(id: string, companyName: string, contactName: string, contactEmail: string, contactPhone: string, address: string){
    const customer = new UpdateCustomerRequest(id, companyName, contactName, contactEmail, contactPhone, address);
    this.customerService.updateCustomer(customer).subscribe({
      next: (result) => {
        this.toastr.success('Müşteri Güncellenmiştir');
        this.loadCustomer();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteCustomer(id: any){
    this.customerService.deleteCustomer(id).subscribe(
      {
        next: (result) =>{
          this.toastr.success("Müşteri silinmiştir")
          this.loadCustomer();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  generatePDF() {
    const fileName = 'customers.pdf';
    const tableTitle = 'Müşteri Listesi';
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

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
