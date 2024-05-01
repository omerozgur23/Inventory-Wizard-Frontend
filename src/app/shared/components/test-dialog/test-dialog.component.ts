import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.scss'
})
export class TestDialogComponent {
  title = '';
  inputLabels: string[] = [];
  createTestForm!: FormGroup;
  dropdownOptions: any[] = [];
  // showDropdown = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TestDialogComponent>,
  ) {
    this.createTestForm = this.fb.group({
      values: this.fb.array([], Validators.required),
    });
  }

  get values() {
    return this.createTestForm.get('values') as FormArray;
  }

  addInput() {
    const inputFormControl = new FormGroup({
      inputValue: new FormControl('', Validators.required)
    });
    // const inputFormControl = new FormControl('', Validators.required)
    this.values.push(inputFormControl);
  }

  addDropdown() {
    const dropdownFormGroup = new FormGroup({
      dropdownValue: new FormControl('', Validators.required)
    });
    // const dropdownFormGroup = new FormControl('', Validators.required)
    this.values.push(dropdownFormGroup);
  }

  isInputControl(control: AbstractControl): boolean {
    return control.get('inputValue') instanceof FormControl;
  }

  isDropdownControl(control: AbstractControl): boolean {
    return control instanceof FormGroup && control.contains('dropdownValue');
  }

  create() {
    if (this.createTestForm.valid) {
      this.dialogRef.close({ result: 'yes' });
    }
  }

  close() {
    this.dialogRef.close({ result: 'no' });
  }
}
