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

import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { GetRolesResponse } from '../dto/getRolesResponse';
import { RoleDTO } from '../dto/RoleDTO';

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
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;
  roleList: GetRolesResponse[] = [];
  // totalPages: number = 10;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private translateService: TranslateService,
  ){}

  setSelectedEmployee(employeeId: string) {
    this.id = employeeId;
  }

  ngOnInit(): void {
    this.loadEmployee();
    this.getAllRoles();
  }
  
  loadEmployee() {
    this.employeeService.getEmployeesByPage(this.currentPage, 18).subscribe({
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
    this.loadEmployee();
  }

  getAllEmployee() {
    this.employeeService.getAllEmployee().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllRoles(){
    this.employeeService.getAllRoles().subscribe({
      next: (result) => {
        this.roleList = result;
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
    dialog.componentInstance.inputLabels = ['employeeTableFirstName', 'employeeTableLastName', 'employeeTableEmail', 'employeeTablePassword'];
    dialog.componentInstance.roleDropdownOptions = this.roleList;
    for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
      dialog.componentInstance.addInput();
    }
    dialog.componentInstance.addRoleDropdown();

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const formValues = dialog.componentInstance.createForm.value.values;
          const firstNameValue = formValues[0].inputValue;
          const lastNameValue =  formValues[1].inputValue;
          const emailValue =  formValues[2].inputValue;
          const passwordValue =  formValues[3].inputValue;
          const roleIdValue =  formValues[4].roleDropdownValue;
          this.createEmployee(firstNameValue, lastNameValue, emailValue, passwordValue, roleIdValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createEmployee(firstName: string, lastName: string, email: string, password: string, roleId: string){
    const successCreatedMessage = this.translateService.instant("employeeCreatedMessage");

    const role = new RoleDTO(roleId);
    const rolesArray: RoleDTO[] = [role];
    
    const employee = new CreateEmployeeRequest(firstName, lastName, email, password, rolesArray);
    this.employeeService.createEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success(successCreatedMessage);
        this.loadEmployee();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
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
    const successUpdatedMessage = this.translateService.instant("employeeUpdatedMessage");
    const employee = new UpdateEmployeeRequest(id, email, password);
    this.employeeService.updateEmployee(employee).subscribe({
      next: (resp) => {
        this.toastr.success(successUpdatedMessage);
        this.loadEmployee();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    })
  }

  deleteEmployee(id: any) {
    const successDeletedMessage = this.translateService.instant("employeeDeletedMessage");
    this.employeeService.deleteEmployee(id).subscribe(
      {
        next: (result) => {
          this.toastr.success(successDeletedMessage);
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
          this.genericService.showError("errorMessage");
        }
      }
    );
  }

  generatePDF() {
    const fileName = 'employees.pdf';
    const tableTitle = this.translateService.instant("employeePdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
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
