import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.scss'
})
export class UpdateModalComponent {
  // inputs: any[] = [];
  title = '';
  inputLabels: string[] = [];
  
  updateForm!: FormGroup;
  // updateForm = this.fb.group({
  //   values: this.fb.array([])
  // });

  // switch ile dropdown dene => NgSwitch
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
    console.log(this.values.value);
  }

  update(){
    this.dialogRef.close({result: 'yes'});
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
