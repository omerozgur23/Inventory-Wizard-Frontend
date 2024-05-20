import { CreateModalComponent } from './../../../shared/components/create-modal/create-modal.component';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../service/employee.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateEmployeeRequest } from '../dto/createEmployeeRequest';
import { UpdateEmployeeRequest } from '../dto/updateEmployeeRequest';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { GetRolesResponse } from '../dto/getRolesResponse';
import { RoleDTO } from '../dto/RoleDTO';
import { AuthService } from '../../../core/service/auth.service';
import { SearchEmployeeRequest } from '../dto/searchEmployeeRequest';
import { DeleteEmployeeRequest } from '../dto/deleteEmployeeRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { Validators } from '@angular/forms';

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
  selectedEmployee: any;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ){}

  setSelectedEmployee(employeeId: string) {
    this.id = employeeId;
    const employee = this.tableData.find(emp => emp.id === employeeId);
    this.selectedEmployee = employee;
  }

  ngOnInit(): void {
    this.loadEmployee();
    this.getAllRoles();
  }
  
  loadEmployee() {
    this.employeeService.getEmployeesByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
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
    if (this.authService.isAdmin()) {
      let dialog = this.dialog.open(CreateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title = 'createEmployeeTitle';
      dialog.componentInstance.inputLabels = ['employeeTableFirstName', 'employeeTableLastName', 'employeeTableEmail'];
      dialog.componentInstance.roleDropdownOptions = this.roleList;
      for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
        dialog.componentInstance.addInput();
      }
      dialog.componentInstance.addPasswordInput();
      dialog.componentInstance.addRoleDropdown();

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
            const formValues = dialog.componentInstance.createForm.value.values;
            const firstNameValue = formValues[0].inputValue;
            const lastNameValue =  formValues[1].inputValue;
            const emailValue =  formValues[2].inputValue;
            const passwordValue =  formValues[3].passwordInputValue;
            const roleIdValue =  formValues[4].roleDropdownValue.id;
            this.createEmployee(firstNameValue, lastNameValue, emailValue, passwordValue, roleIdValue);
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
    if (this.authService.isAdmin()) {
      let dialog =  this.dialog.open(UpdateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title='updateEmployeeTitle';
      dialog.componentInstance.inputLabels=['employeeTableEmail'];
      dialog.componentInstance.roleDropdownOptions = this.roleList;
      dialog.componentInstance.addInput(item.email, [Validators.required, Validators.email]);
      dialog.componentInstance.addPasswordInput('');
      dialog.componentInstance.addRoleDropdown();

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
          const emailValue =  dialog.componentInstance.updateForm.value.values[0].inputValue;
          const passwordValue =  dialog.componentInstance.updateForm.value.values[1].passwordInputValue;
          const roleIdValue =  dialog.componentInstance.updateForm.value.values[2].roleDropdownValue.id;
          this.updateEmployee(item.id, emailValue, passwordValue, roleIdValue);
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

  updateEmployee(id: string, email: string, password: string, roleId: string){
    const successUpdatedMessage = this.translateService.instant("employeeUpdatedMessage");

    const role = new RoleDTO(roleId);
    const rolesArray: RoleDTO[] = [role];

    const employee = new UpdateEmployeeRequest(id, email, password, rolesArray);
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
    if (this.authService.isAdmin()) {
      const loggedInUserEmail = this.authService.getLoggedInUserEmail();
      const successDeletedMessage = this.translateService.instant("employeeDeletedMessage");
      const employee = new DeleteEmployeeRequest(id);
      if (loggedInUserEmail === this.selectedEmployee.email) {
        this.genericService.showError("adminCannotDeleteItselfMessage");
        return;
      }
      this.employeeService.deleteEmployee(employee).subscribe(
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
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  generatePDF() {
    const fileName = 'employees.pdf';
    const tableTitle = this.translateService.instant("employeePdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      const keyword = new SearchEmployeeRequest(searchKeyword);
      setTimeout(() => 
        this.employeeService.search(keyword).subscribe({
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
      this.loadEmployee();
    }
  }
}
