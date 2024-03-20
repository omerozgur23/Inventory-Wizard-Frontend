import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { Observable, forkJoin } from 'rxjs';
import { Product } from '../dto/product';
import { Category } from '../dto/category';
import { Supplier } from '../dto/supplier';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  productList: Product[] = [];

  categoryList: Category[] = [];
  supplierList: Supplier[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  navigateCreateProduct(){
    this.router.navigate(['./product-create'], { relativeTo: this.route });
  }

  navigateUpdateProduct(){
    this.router.navigate(['./product-update'], { relativeTo: this.route });
  }

  deleteProduct(id: any){
    this.productService.deleteProduct(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Ürün silinmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  ngOnInit(): void{
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.productService.getCategories(),
      suppliers: this.productService.getSuppliers()
    }).subscribe(
      (response) => {
        this.productList = response.products;
        this.categoryList = response.categories;
        this.supplierList = response.suppliers;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // shortenUUID(uuid: string): string {
  //   return uuid.split('-')[0];
  // }

  // convertToOrdinal(index: number): string {
  //   return (index + 1).toString();
  // }
} 
