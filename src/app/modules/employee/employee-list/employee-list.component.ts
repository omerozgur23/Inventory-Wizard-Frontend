import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../dto/employee';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Adı', field: 'firstName' },
    { label: 'Soyadı', field: 'lastName'},
    { label: 'E-Mail', field: 'email'},
    { label: 'Roller', field: 'role'},
  ]

  id: string = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  setSelectedEmployee(employeeId: string) {
    this.id = employeeId;
  }

  ngOnInit(): void {
    this.loadEmployee();
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadEmployee();
  }

  loadEmployee() {
    this.employeeService.getAllEmployeesByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  navigateCreate(){
    this.router.navigate(['./employee-create'], { relativeTo: this.route });
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe((employees: any[]) => {
      this.tableData = employees;
    });
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

  updateEmployee(id: string, firstName: string, lastName: string, email: string, password: string, role: string){
    const employee = new Employee(id, firstName, lastName, email, password, role);
    this.employeeService.updateEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success('Kullanıcı Güncellenmiştir');
        this.loadEmployee();
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
        const firstNameValue =  dialog.componentInstance.updateForm.value.values[0];
        const lastNameValue =  dialog.componentInstance.updateForm.value.values[1];
        const emailValue =  dialog.componentInstance.updateForm.value.values[2];
        const passwordValue =  dialog.componentInstance.updateForm.value.values[3];
        const roleValue =  dialog.componentInstance.updateForm.value.values[4];
        this.updateEmployee(item.id, firstNameValue, lastNameValue, emailValue, passwordValue, roleValue);
        }
      }
    });
    dialog.componentInstance.title='Kullanıcı Güncelle';
    dialog.componentInstance.inputLabels=['Adı'];
    dialog.componentInstance.inputLabels=['Soyadı'];
    dialog.componentInstance.inputLabels=['E-mail'];
    dialog.componentInstance.inputLabels=['Şifre'];
    dialog.componentInstance.inputLabels=['Rol'];
    dialog.componentInstance.values.push(new FormControl(item.firstName));
    dialog.componentInstance.values.push(new FormControl(item.lastName));
    dialog.componentInstance.values.push(new FormControl(item.email));
    dialog.componentInstance.values.push(new FormControl(item.password));
    dialog.componentInstance.values.push(new FormControl(item.role));
  }
  

  
}
