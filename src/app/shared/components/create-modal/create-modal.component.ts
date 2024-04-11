import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss'
})
export class CreateModalComponent {
  title = '';
  inputLabels: string[] = [];
  createForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateModalComponent>,
  ){}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      values: this.fb.array([this.createValueFormControl()])
    });
  }

  createValueFormControl(): FormControl {
    return this.fb.control('', Validators.required);
  }

  get values() {
    return this.createForm.get('values') as FormArray;
  }

  addValue(): void {
    // const newControl = this.fb.control('', Validators.required);
    // this.values.push(newControl);
    const value = new FormControl('');
    this.values.push(value);
  }

  create(){
    this.dialogRef.close({result: 'yes', createForm: this.dialogRef.componentInstance.createForm});
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
