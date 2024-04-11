import { UpdateCustomerDTO } from '../dto/updateCustomerDTO';
import { Component, OnInit, input } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Firma Ünvanı', field: 'companyName' },
    { label: 'Firma Yetkilisi', field: 'contactName' },
    { label: 'Yetkili E-Mail', field: 'email' },
    { label: 'Yetkili Telefon', field: 'contactPhone' },
    { label: 'Vergi No', field: 'taxNumber' },
    { label: 'Adres', field: 'address' },
  ];

  id: string = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  setSelectedCustomer(customerId: string) {
    this.id = customerId;
  }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    this.customerService.getAllCustomersByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCustomer();
  }

  create() {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
  
    dialogRef.componentInstance.title = 'Müşteri Ekle';
    dialogRef.componentInstance.inputLabels = ['Firma Ünvanı','Firma Yetkilisi','E-Mail','Yetkili Telefon','Vergi No','Adres'];
    dialogRef.componentInstance.values.push(new FormControl(input));
    dialogRef.componentInstance.values.push(new FormControl(input));
    dialogRef.componentInstance.values.push(new FormControl(input));
    dialogRef.componentInstance.values.push(new FormControl(input));
    dialogRef.componentInstance.values.push(new FormControl(input));
    dialogRef.componentInstance.values.push(new FormControl(input));
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.result === 'yes') {
        // const formValues = result.createForm.value.values;
        // const [companyName, contactName, email, contactPhone, taxNumber, address] = formValues;
        const companyName = result.createForm.value.values[0];
        const contactName = result.createForm.value.values[0];
        const email = result.createForm.value.values[0];
        const contactPhone = result.createForm.value.values[0];
        const taxNumber = result.createForm.value.values[0];
        const address = result.createForm.value.values[0];
        this.customerService.createCustomer(companyName, contactName, email, contactPhone, taxNumber, address).subscribe(
          (response) => {
            this.toastr.success('Müşteri başarıyla oluşturuldu');
            this.loadCustomer();
          },
          (error) => {
            console.error('Müşteri oluşturma hatası:', error);
            this.toastr.error('Müşteri oluşturulurken bir hata oluştu');
          }
        );
      }
    });
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

  updateCustomer(id: string, companyName: string, contactName: string, email: string, contactPhone: string, address: string){
    const customer = new UpdateCustomerDTO(id, companyName, contactName, email, contactPhone, address);
    this.customerService.updateCustomer(customer).subscribe({
      next: (resp) => {
        this.toastr.success('Müşteri Güncellenmiştir');
        this.loadCustomer();
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
        const companyNameValue =  dialog.componentInstance.updateForm.value.values[0];
        const contactNameValue =  dialog.componentInstance.updateForm.value.values[1];
        const emailValue =  dialog.componentInstance.updateForm.value.values[2];
        const contactPhoneValue =  dialog.componentInstance.updateForm.value.values[3];
        const addressValue =  dialog.componentInstance.updateForm.value.values[4];
        
        this.updateCustomer(item.id, companyNameValue, contactNameValue, emailValue, contactPhoneValue, addressValue);
        }
      }
    });
    dialog.componentInstance.title='Müşteri Güncelle';
    dialog.componentInstance.inputLabels=['Firma Ünvanı','Firma Yetkilisi','E-Mail','Yetkili Telefon', 'Adres'];
    dialog.componentInstance.values.push(new FormControl(item.companyName));
    dialog.componentInstance.values.push(new FormControl(item.contactName));
    dialog.componentInstance.values.push(new FormControl(item.email));
    dialog.componentInstance.values.push(new FormControl(item.contactPhone));
    dialog.componentInstance.values.push(new FormControl(item.address));

  }
}
