import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.scss'
})
export class UpdateModalComponent {
  @Output() updateEvent = new EventEmitter<any>();
  @Output() submitEvent = new EventEmitter<any>();
  categoryForm = this.fb.group({
    categoryName: ''
  });

  constructor(
    private fb: FormBuilder,
  ){}

  selectedId: string = '';

  update(id: any){
    this.updateEvent.emit(id);
  }

  submitt(){
    this.submitEvent.emit();
  }
}
