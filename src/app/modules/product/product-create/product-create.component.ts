// import { SupplierService } from './../../supplier/service/supplier.service';
// import { Component, OnInit  } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { ProductService } from '../service/product.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { forkJoin } from 'rxjs';
// import { GetCategoryResponse } from '../../category/dto/getCategoryResponse';
// import { GetSupplierResponse } from '../../supplier/dto/getSupplierResponse';
// import { CategoryService } from '../../category/service/category.service';

// @Component({
//   selector: 'app-product-create',
//   templateUrl: './product-create.component.html',
//   styleUrl: './product-create.component.scss'
// })
// export class ProductCreateComponent {
//   categoryList: GetCategoryResponse[] = [];
//   supplierList: GetSupplierResponse[] = [];

//   productForm = this.fb.group({
//     productName: '',
//     categoryId: '',
//     supplierId: '',
//     purchasePrice: 0,
//     unitPrice: 0,
//     quantity: 0,
//   });

//   constructor(
//     private fb: FormBuilder,
//     private toastr: ToastrService,
//     private productService: ProductService,
//     private categoryService: CategoryService,
//     private supplierService: SupplierService,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {}

//   ngOnInit(): void{
//     forkJoin({
//       categories: this.categoryService.getCategory(),
//       suppliers: this.supplierService.getAllSupplier()
//     }).subscribe({
//       next: (resp => {
//         this.categoryList = resp.categories;
//         this.supplierList = resp.suppliers;
//       }),
//       error: (err => {
//         console.log(err);
//       })
//     })
//   }

//   submit() {
//     // this.productService.createProduct(this.productForm.value ).subscribe({
//     //   next: (resp) => {
//     //     this.toastr.success('Ürün Oluşturulmuştur');
//     //     this.router.navigate(['..'], {relativeTo: this.route});
//     //   },
//     //   error: (err) => {
//     //     console.log(err);
//     //     this.toastr.error("Hata oluştu");
//     //   }
//     // });
//   }
// }
