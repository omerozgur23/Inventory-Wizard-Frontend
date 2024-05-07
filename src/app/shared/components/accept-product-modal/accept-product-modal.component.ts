import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetProductResponse } from '../../../modules/product/dto/getProductResponse';

@Component({
  selector: 'app-accept-product-modal',
  templateUrl: './accept-product-modal.component.html',
  styleUrls: ['./accept-product-modal.component.scss']
})
export class AcceptProductModalComponent {
  title = '';
  productList: any[] = [];
  acceptProductForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AcceptProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {
    this.title = data.title;
    this.productList = data.productList;
    
    this.acceptProductForm = this.fb.group({
      productId: ['', Validators.required], 
      count: [, Validators.required]
    });
  }

  create() {
    if (this.acceptProductForm.valid) {
      this.dialogRef.close({ result: 'yes', formValue: this.acceptProductForm.value });
    }
  }

  close() {
    this.dialogRef.close({ result: 'no' });
  }
}
