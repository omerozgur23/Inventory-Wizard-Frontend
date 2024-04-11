import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCustomerDTO } from '../../customer/dto/updateCustomerDTO';
import { Employee } from '../../employee/dto/employee';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../category/service/category.service';
import { EmployeeService } from '../../employee/service/employee.service';
import { CustomerService } from '../../customer/service/customer.service';
import { ShelfService } from '../../warehouse/service/shelf.service';
import { Product } from '../dto/product';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.scss'
})
export class ProductSaleComponent {
  customerList: UpdateCustomerDTO[] = [];
  employeeList: Employee[] = [];
  productList: Product[] = [];

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
      categories: this.customerService.getCustomers(),
      suppliers: this.employeeService.getEmployee(),
      products: this.productService.getProducts(),
    }).subscribe({
      next: (resp => {
        this.customerList = resp.categories;
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
