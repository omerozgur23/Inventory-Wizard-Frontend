import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCustomerRequest } from '../../customer/dto/updateCustomerRequest';
import { GetEmployeeResponse } from '../../employee/dto/getEmployeeResponse';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../category/service/category.service';
import { EmployeeService } from '../../employee/service/employee.service';
import { CustomerService } from '../../customer/service/customer.service';
import { ShelfService } from '../../warehouse/service/shelf.service';
import { GetProductResponse } from '../dto/getProductResponse';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.scss'
})
export class ProductSaleComponent implements OnInit{
  customerList: UpdateCustomerRequest[] = [];
  employeeList: GetEmployeeResponse[] = [];
  productList: GetProductResponse[] = [];

  saleForm = this.fb.group({
    productId: '',
    count: 0,
    customerId: '',
    userId: '',
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void{
    forkJoin({
      customers: this.customerService.getCustomers(),
      suppliers: this.employeeService.getEmployee(),
      products: this.productService.getAllProducts(),
    }).subscribe({
      next: (resp => {
        this.customerList = resp.customers;
        this.employeeList = resp.suppliers;
        this.productList = resp.products;
      }),
      error: (err => {
        console.log(err);
      })
    })
  }

  submit(){
    this.productService.saleProduct(this.saleForm.value).subscribe({
      next: (resp) => {
        this.toastr.success('Ürün Satışı Yapılmıştır');
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }
}
