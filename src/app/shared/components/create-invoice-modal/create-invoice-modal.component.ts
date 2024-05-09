import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-invoice-modal',
  templateUrl: './create-invoice-modal.component.html',
  styleUrl: './create-invoice-modal.component.scss'
})
export class CreateInvoiceModalComponent {
  @Output() createInvoiceEvent = new EventEmitter<any>();
  selectedId = '';

  createInvoice(id: any){
    this.createInvoiceEvent.emit(id);
  }
}
