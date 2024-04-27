import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Output() deleteEvent = new EventEmitter<any>();
  @Input() description = '';
  selectedId = '';

  delete(id: any){
    this.deleteEvent.emit(id);
  }
}
