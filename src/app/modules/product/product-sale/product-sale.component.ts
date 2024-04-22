import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
import { SaleRequest } from './saleRequest';

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
  
  // saleForm = this.fb.group({
  //   productId: '',
  //   count: 0,
  //   customerId: '',
  //   userId: '',
  // });

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

    this.saleProductForm = this.fb.group({
      customerId: '',
      userId: '',
      productItems: this.fb.array([this.createProductGroup()]),
      // orderDate: '',
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
      const saleRequest: SaleRequest = this.saleProductForm.value;
      // const saleRequest: SaleRequest = {
      //   productItems: this.saleProductForm.value.productItems,
      //   customerId: this.saleProductForm.value.customerId,
      //   userId: this.saleProductForm.value.userId,
      //   orderDate: new Date().toISOString() // Şu anki tarih/datetime değeri ISO formatında
      // };
      this.productService.saleProductTest(saleRequest).subscribe({
        next: (resp) => {
          console.log("component submit: " + JSON.stringify(saleRequest) );
          
          this.toastr.success('Ürün Satışı Başarıyla Tamamlandı');
          // Başarılı olduğunda yapılacak işlemler
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
  // submit(){
  //   this.productService.saleProduct(this.saleProductForm.value).subscribe({
  //     next: (resp) => {
  //       this.toastr.success('Ürün Satışı Yapılmıştır');
  //       this.router.navigate(['..'], {relativeTo: this.route});
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.toastr.error("Hata oluştu");
  //     }
  //   })
  // }
  // saleProductForm = this.fb.group({
  //   customerAndEmployeeInfo: this.fb.group({
  //     customerId: '',
  //     userId: '',
  //   }),
  //   products: this.fb.array([
  //     this.fb.group({
  //       productId: '',
  //       count: 0,
  //     }),
  //   ]),
  // });

  // get productsGroups() {
  //   return this.saleProductForm.get('products') as FormArray;
  // }

  // addProduct() {
  //   this.productsGroups.push(
  //     this.fb.group({
  //       productId: '',
  //       count: 0,
  //     })
  //   );
  // }

  // removeProduct(index: number) {
  //   this.productsGroups.removeAt(index);
  // }
}
