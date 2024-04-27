import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCustomerRequest } from '../../customer/dto/updateCustomerRequest';
import { GetEmployeeResponse } from '../../employee/dto/getEmployeeResponse';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../employee/service/employee.service';
import { CustomerService } from '../../customer/service/customer.service';
import { GetProductResponse } from '../dto/getProductResponse';
import { SaleProductRequest } from '../dto/saleProductRequest';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.scss'
})
export class ProductSaleComponent implements OnInit{
  customerList: UpdateCustomerRequest[] = [];
  employeeList: GetEmployeeResponse[] = [];
  productList: GetProductResponse[] = [];
  saleProductForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void{
    forkJoin({
      customers: this.customerService.getAllCustomer(),
      suppliers: this.employeeService.getAllEmployee(),
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

    this.saleProductForm = this.fb.group({
      customerId: '',
      userId: '',
      productItems: this.fb.array([this.createProductGroup()]),
    });
  }

  get productItems(): FormArray {
    return this.saleProductForm.get('productItems') as FormArray;
  }

  createProductGroup(): FormGroup {
    return this.fb.group({
      productId: '',
      count: 0
    });
  }

  addProduct(): void {
    this.productItems.push(this.createProductGroup());
  }

  removeProduct(index: number): void {
    this.productItems.removeAt(index);
  }

  submit(): void {
    if (this.saleProductForm.valid) {
      const saleRequest: SaleProductRequest = this.saleProductForm.value;
      this.productService.saleProduct(saleRequest).subscribe({
        next: (result) => {
          this.toastr.success('Ürün Satışı Başarıyla Tamamlandı');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Satış sırasında bir hata oluştu');
        }
      });
    } else {
      this.toastr.error('Lütfen formu eksiksiz doldurun');
    }
  }
}
