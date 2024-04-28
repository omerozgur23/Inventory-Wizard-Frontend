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
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'employeeTableFirstName', field: 'firstName' },
    { label: 'employeeTableLastName', field: 'lastName'},
    { label: 'employeeTableEmail', field: 'email'},
    { label: 'employeeTableRoles', field: 'role'},
  ]

  tableTitle = "employeeTableTitle";
  deleteDialogDescription = 'deleteEmployeeDialogDescription';
  id: string = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService,
  ){}

  setSelectedEmployee(employeeId: string) {
    this.id = employeeId;
  }

  ngOnInit(): void {
    this.loadEmployee();
  }
  
  loadEmployee() {
    this.employeeService.getEmployeesByPage(this.currentPage, 18).subscribe({
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
    this.loadEmployee();
  }

  getAllEmployee() {
    this.employeeService.getAllEmployee().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateEmployeeDialog(){
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title = 'createEmployeeTitle';
    dialog.componentInstance.inputLabels = ['employeeTableFirstName', 'employeeTableLastName', 'employeeTableEmail', 'employeeTablePassword', 'employeeTableRoles'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));

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
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createEmployee(firstName: string, lastName: string, email: string, password: string, role: string){
    const employee = new CreateEmployeeRequest(firstName, lastName, email, password, role);
    this.employeeService.createEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success('Personel Oluşturuldu');
        this.loadEmployee();
      },
      error: (err) => {
        console.log(err);
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

    dialog.componentInstance.title='updateEmployeeTitle';
    dialog.componentInstance.inputLabels=['employeeTableEmail', 'employeeTablePassword'];
    dialog.componentInstance.values.push(new FormControl(item.email));
    dialog.componentInstance.values.push(new FormControl("******"));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const emailValue =  dialog.componentInstance.updateForm.value.values[0];
        const passwordValue =  dialog.componentInstance.updateForm.value.values[1];
        this.updateEmployee(item.id, emailValue, passwordValue); 
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateEmployee(id: string, email: string, password: string){
    const employee = new UpdateEmployeeRequest(id, email, password);
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

  deleteEmployee(id: any) {
    this.employeeService.deleteEmployee(id).subscribe(
      {
        next: (result) => {
          this.toastr.success("Personel silinmiştir");
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Hata oluştu");
        }
      }
    );
  }

  generatePDF() {
    const fileName = 'employees.pdf';
    const tableTitle = 'Personel Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.employeeService.search(searchKeyword).subscribe({
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
      this.loadEmployee();
    }
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
