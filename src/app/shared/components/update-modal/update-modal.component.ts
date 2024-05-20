import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  categoryDropdownOptions: any[] = [];
  supplierDropdownOptions: any[] = [];
  roleDropdownOptions: any[] = [];
  selectedCategory: any;
  selectedSupplier: any;
  selectedRole: any;

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

  addInput(initialValue: string, validators: ValidatorFn[] = []) {
    const inputFormControl = new FormGroup({
      inputValue: new FormControl(initialValue, validators)
    });
    this.values.push(inputFormControl);
  }

  addPasswordInput(initialValue: string, validators: ValidatorFn[] = []) {
    const passwordInputFormControl = new FormGroup({
      passwordInputValue: new FormControl(initialValue, validators)
    });
    this.values.push(passwordInputFormControl);
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

  isPasswordInputControl(control: AbstractControl): boolean {
    return control.get('passwordInputValue') instanceof FormControl;
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
