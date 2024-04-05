import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '../../../shared/components/table/dto/table';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  // employeeList: Employee[] = [];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Adı', field: 'firstName' },
    { label: 'Soyadı', field: 'lastName'},
    { label: 'E-Mail', field: 'email'},
    { label: 'Roller', field: 'role'},
  ]

  constructor(
    // private fb: FormBuilder,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.getEmployee();
  }

  navigateCreate(){
    this.router.navigate(['./employee-create'], { relativeTo: this.route });
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe((employees: any[]) => {
      this.tableData = employees;
    });
  }
 
  // ngOnInit(): void{
  //   forkJoin({
  //     employees: this.employeeService.getEmployee()
  //   }).subscribe(
  //     (response) => {
  //       this.employeeList = response.employees;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

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
