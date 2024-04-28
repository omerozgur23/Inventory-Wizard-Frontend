import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  dropdownOptions: any[] = [];
  showDropdown = false;
  
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

  addValue() {
    const value = new FormControl('', Validators.required);
    this.values.push(value);
    console.log(this.values.value);
  }
 
  create(){
    if (this.createForm.valid) {
      // const formValues = { ...this.createForm.value, categoryId: this.createForm.value.categoryId };
      this.dialogRef.close({result: 'yes'});
    } 
  }

  close(){
    this.dialogRef.close({result: 'no'});
  }
}
