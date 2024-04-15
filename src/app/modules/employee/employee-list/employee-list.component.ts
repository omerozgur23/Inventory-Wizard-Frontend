import { CreateModalComponent } from './../../../shared/components/create-modal/create-modal.component';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../service/employee.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateEmployeeRequest } from '../dto/createEmployeeRequest';
import { UpdateEmployeeRequest } from '../dto/updateEmployeeRequest';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Adı', field: 'firstName' },
    { label: 'Soyadı', field: 'lastName'},
    { label: 'E-Mail', field: 'email'},
    { label: 'Roller', field: 'role'},
  ]

  deleteDialogDescription = 'Personel kaydını silmek istediğinizden emin misiniz?';
  id: string = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ){}

  setSelectedEmployee(employeeId: string) {
    this.id = employeeId;
  }

  ngOnInit(): void {
    this.loadEmployee();
  }
  
  loadEmployee() {
    this.employeeService.getAllEmployeesByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadEmployee();
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe((employees: any[]) => {
      this.tableData = employees;
    });
  }

  openCreateEmployeeDialog(){
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const firstNameValue = dialog.componentInstance.createForm.value.values[0];
          const lastNameValue =  dialog.componentInstance.createForm.value.values[1];
          const emailValue =  dialog.componentInstance.createForm.value.values[2];
          const passwordValue =  dialog.componentInstance.createForm.value.values[3];
          const roleValue =  dialog.componentInstance.createForm.value.values[4];
          this.createEmployee(firstNameValue, lastNameValue, emailValue, passwordValue, roleValue);
        }
      }
    });
    dialog.componentInstance.title = 'Yeni Personel Oluştur';
    dialog.componentInstance.inputLabels = ['Ad', 'Soyad', 'E-Mail', 'Şifre', 'Rol'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
  }

  createEmployee(firstName: string, lastName: string, email: string, password: string, role: string){
    const employee = new CreateEmployeeRequest(firstName, lastName, email, password, role);
    this.employeeService.createEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success('Personel Oluşturuldu');
        this.loadEmployee();
      },
      error: (err) => {
        this.toastr.error('Hata oluştu');
      }
    });
  }
 
  openUpdateEmployeeDialog(item: any){
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const emailValue =  dialog.componentInstance.updateForm.value.values[2];
        const passwordValue =  dialog.componentInstance.updateForm.value.values[3];
        const roleValue =  dialog.componentInstance.updateForm.value.values[4];
        this.updateEmployee(item.id, emailValue, passwordValue, roleValue);
        }
      }
    });
    dialog.componentInstance.title='Personel Güncelle';
    dialog.componentInstance.inputLabels=['E-mail'];
    dialog.componentInstance.inputLabels=['Şifre'];
    dialog.componentInstance.inputLabels=['Rol'];
    dialog.componentInstance.values.push(new FormControl(item.email));
    dialog.componentInstance.values.push(new FormControl(item.password));
    dialog.componentInstance.values.push(new FormControl(item.role));
  }

  updateEmployee(id: string, email: string, password: string, role: string){
    const employee = new UpdateEmployeeRequest(id, email, password, role);
    this.employeeService.updateEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success('Kullanıcı Güncellenmiştir');
        this.loadEmployee();
      },
      error: (err) => {
        // console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteEmployee(id: any) {
    this.employeeService.deleteEmployee(id).subscribe(
      {
        next: (id) => {
          this.toastr.success("Personel silinmiştir");
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu");
        }
      }
    );
  }
}
