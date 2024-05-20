import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss'
})
export class CreateModalComponent {
  title = '';
  inputLabels: string[] = [];
  createForm!: FormGroup;
  categoryDropdownOptions: any[] = [];
  supplierDropdownOptions: any[] = [];
  roleDropdownOptions: any[] = [];
  selectedCategory: any;
  selectedSupplier: any;
  selectedRole: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateModalComponent>,
  ) {
    this.createForm = this.fb.group({
      values: this.fb.array([], Validators.required),
    });
  }

  get values() {
    return this.createForm.get('values') as FormArray;
  }

  addInput() {
    const inputFormControl = new FormGroup({
      inputValue: new FormControl('', Validators.required)
    });
    this.values.push(inputFormControl);
  }

  addPasswordInput() {
    const passwordInputFormControl = new FormGroup({
      passwordInputValue: new FormControl('', Validators.required)
    });
    this.values.push(passwordInputFormControl);
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

  addRoleDropdown() {
    const roleDropdownFormGroup = new FormGroup({
      roleDropdownValue: new FormControl('', Validators.required)
    });
    this.values.push(roleDropdownFormGroup);
  }

  isInputControl(control: AbstractControl): boolean {
    return control.get('inputValue') instanceof FormControl;
  }

  isPasswordInputControl(control: AbstractControl): boolean {
    return control.get('passwordInputValue') instanceof FormControl;
  }

  isCategoryDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('categoryDropdownValue');
  }

  isSupplierDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('supplierDropdownValue');
  }

  isRoleDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('roleDropdownValue');
  }
 
  create(){
    if (this.createForm.valid) {
      this.dialogRef.close({result: 'yes'});
    } 
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
