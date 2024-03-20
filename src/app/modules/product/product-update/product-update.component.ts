import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.scss'
})
export class ProductUpdateComponent {
  productForm = this.fb.group({
    productName: '',
    categoryId: '',
    costPrice: 0,
    unitPrice: 0,
    quantity: 0,
  });
  constructor(
    private fb: FormBuilder,
    private router: Router
  ){}

  submit(){
    
  }
}
