import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  addValue() {
    const value = new FormControl('');
    this.values.push(value);
  }

  update(){
    this.dialogRef.close({result: 'yes'});
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
