import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-product-modal',
  templateUrl: './accept-product-modal.component.html',
  styleUrl: './accept-product-modal.component.scss'
})
export class AcceptProductModalComponent {
  title = '';
  inputLabels: string[] = [];
  dropdownLables: string[] = [];
  acceptProductForm!: FormGroup; 
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AcceptProductModalComponent>,
  ) {
    this.acceptProductForm = this.fb.group({
      values: this.fb.array([], Validators.required),
    })
  }

  get values() {
    return this.acceptProductForm.get('values') as FormArray;
  }

  addValue() {
    const value = new FormControl('', Validators.required);
    this.values.push(value);
    console.log(this.values.value);
  }

  create(){
    if (this.acceptProductForm.valid) {
      this.dialogRef.close({result: 'yes'});
    }
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
