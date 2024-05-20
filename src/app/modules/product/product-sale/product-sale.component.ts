import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../employee/service/employee.service';
import { CustomerService } from '../../customer/service/customer.service';
import { SaleProductRequest } from '../dto/saleProductRequest';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.scss'
})
export class ProductSaleComponent implements OnInit{
  customerList: any[] = [];
  employeeList: any[] = [];
  productList: any[] = [];
  selectedCustomer: any;
  selectedEmployee: any;
  selectedProduct: any;
  saleProductForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private genericService: GenericService,
    private translateService: TranslateService, 
  ) {}

  ngOnInit(): void{
    forkJoin({
      customers: this.customerService.getAllCustomer(),
      suppliers: this.employeeService.getAllEmployee(),
      products: this.productService.getAllProducts(),
    }).subscribe({
      next: (resp => {
        this.customerList = resp.customers.data;
        this.employeeList = resp.suppliers.data;
        this.productList = resp.products.data;
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
    const successSaleMessage = this.translateService.instant("productSaleMessage");
    if (this.saleProductForm.valid) {
      const customerId = this.selectedCustomer ? this.selectedCustomer.id : null;
      const userId = this.selectedEmployee ? this.selectedEmployee.id : null;
      const saleRequest: SaleProductRequest = {
        customerId,
        userId,
        productItems: this.saleProductForm.value.productItems
      };
      this.productService.saleProduct(saleRequest).subscribe({
        next: (result) => {
          this.toastr.success(successSaleMessage);
          this.resetProductList();
        },
        error: (err) => {
          console.error(err);
          this.genericService.showError("errorMessage");
        }
      });
    } else {
      this.genericService.showError("productSaleFormValid");
    }
  }

  resetProductList(): void {
    while (this.productItems.length > 1) {
      this.productItems.removeAt(1);
    }
    this.saleProductForm.reset({
      customerId: '',
      userId: '',
      productItems: [this.createProductGroup()]
    });
  }
}
