import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../product/dto/product';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../product/service/product.service';

@Component({
  selector: 'app-accept-product',
  templateUrl: './accept-product.component.html',
  styleUrl: './accept-product.component.scss'
})
export class AcceptProductComponent {
  productList: Product[] = [];

  acceptProductForm = this.fb.group({
    productId: '',
    count: 0,
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  submit() {
    this.shelfService.acceptProduct(this.acceptProductForm.value ).subscribe({
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
      products: this.productService.getProducts(),
    }).subscribe({
      next: (resp => {
        this.productList = resp.products;
      }),
      error: (err => {
        console.log(err);
        
      })
    })
  }
}
