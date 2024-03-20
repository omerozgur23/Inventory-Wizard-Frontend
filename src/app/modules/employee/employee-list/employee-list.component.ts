import { Component } from '@angular/core';
import { Employee } from '../dto/employee';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  employeeList: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void{
    forkJoin({
      employees: this.employeeService.getEmployee()
    }).subscribe(
      (response) => {
        this.employeeList = response.employees;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
