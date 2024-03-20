import { Component, OnInit  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../core/service/login.service';
import { Observable, forkJoin } from 'rxjs';
import { Category } from '../dto/category';
import { Supplier } from '../dto/supplier';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {
  categoryList: Category[] = [];
  supplierList: Supplier[] = [];

  productForm = this.fb.group({
    productName: '',
    categoryId: '',
    supplierId: '',
    purchasePrice: 0,
    unitPrice: 0,
    quantity: 0,
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
  ) {}

  submit() {
    
    this.productService.createProduct(this.productForm.value ).subscribe({
      next: (resp) => {
        this.toastr.success('Ürün Oluşturulmuştur');
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }
  
  
  ngOnInit(): void{
    forkJoin({
      categories: this.productService.getCategories(),
      suppliers: this.productService.getSuppliers()
    }).subscribe({
      next: (resp => {
        this.categoryList = resp.categories;
        this.supplierList = resp.suppliers;
      }),
      error: (err => {
        console.log(err);
        
      })
    })
  }
  
}
