import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.scss'
})
export class UpdateModalComponent {
  title = '';
  inputLabels: string[] = [];
  updateForm!: FormGroup;
  roleDropdownOptions: any[] = [];
  categoryDropdownOptions: any[] = [];
  supplierDropdownOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateModalComponent>,
  ) {
    this.updateForm = this.fb.group({
      values: this.fb.array([]),
    })
  }

  get values() {
    return this.updateForm.get('values') as FormArray;
  }

  addInput(initialValue: string) {
    const inputFormControl = new FormGroup({
      inputValue: new FormControl(initialValue, Validators.required)
    });
    this.values.push(inputFormControl);
  }

  addRoleDropdown() {
    const roleDropdownFormGroup = new FormGroup({
      roleDropdownValue: new FormControl('', Validators.required)
    });
    this.values.push(roleDropdownFormGroup);
  }

  addCategoryDropdown() {
    const categoryDropdownFormGroup = new FormGroup({
      categoryDropdownValue: new FormControl('', Validators.required)
    });
    this.values.push(categoryDropdownFormGroup);
  }

  addSupplierDropdown() {
    const supplierDropdownFormGroup = new FormGroup({
      supplierDropdownValue: new FormControl('', Validators.required)
    });
    this.values.push(supplierDropdownFormGroup);
  }

  isInputControl(control: AbstractControl): boolean {
    return control.get('inputValue') instanceof FormControl;
  }

  isRoleDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('roleDropdownValue');
  }

  isCategoryDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('categoryDropdownValue');
  }

  isSupplierDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('supplierDropdownValue');
  }

  update(){
    this.dialogRef.close({result: 'yes'});
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
