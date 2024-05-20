import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-accept-product-modal',
  templateUrl: './accept-product-modal.component.html',
  styleUrls: ['./accept-product-modal.component.scss']
})
export class AcceptProductModalComponent {
  title = '';
  productList: any[] = [];
  acceptProductForm: FormGroup;
  selectedProduct: any;

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
      // this.dialogRef.close({ result: 'yes', formValue: this.acceptProductForm.value });
      const formValue = this.acceptProductForm.value;
      const selectedProductId = this.selectedProduct ? this.selectedProduct.id : null;
      const result = {
        result: 'yes',
        formValue: {
          productId: selectedProductId,
          count: formValue.count
        }
      };
      this.dialogRef.close(result);
    }
  }

  close() {
    this.dialogRef.close({ result: 'no' });
  }
}
