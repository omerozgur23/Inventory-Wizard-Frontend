import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  // dropdownOptions: any[] = [];
  showDropdown = false;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateModalComponent>,
  ) {
    this.createForm = this.fb.group({
      values: this.fb.array([], Validators.required), // values adında bir FormArray oluşturuldu
    });
  }

  // values FormArray'ine erişim sağlamak için bir getter tanımlandı
  get values() {
    return this.createForm.get('values') as FormArray;
  }

  // Yeni bir FormControl eklemek için addValue fonksiyonu
  addValue() {
    const value = new FormControl('', Validators.required);
    this.values.push(value); // values FormArray'ine yeni bir FormControl eklendi
    console.log(this.values.value);
  }
 
  // Formun geçerli olup olmadığını kontrol edip modalı kapatmak için create fonksiyonu
  create(){
    if (this.createForm.valid) {
      this.dialogRef.close({result: 'yes'}); // Modalı kapatıp 'yes' sonucunu iletiliyor
    } 
  }

  // Modalı kapatmak için close fonksiyonu
  close(){
    this.dialogRef.close({result: 'no'}); // Modalı kapatıp 'no' sonucunu iletiliyor
  }
}
