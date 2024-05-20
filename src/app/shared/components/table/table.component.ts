import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn } from './dto/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
  @Input() tableData: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() showOrderDetailButton = false;
  @Input() showInvoiceDetailButton = false;
  @Input() showCreateInvoiceButton = false;
  @Input() IsOrderStatus = true;
  @Input() tableTitle = '';
  @Input() totalPages = 0;
  @Output() navigateUpdateDialogEvent = new EventEmitter<any>();
  @Output() navigateDeleteDialogEvent = new EventEmitter<any>();
  @Output() navigateOrderDetailsEvent = new EventEmitter<any>();
  @Output() navigateCreateInvoiceEvent = new EventEmitter<any>();
  @Output() navigateInvoiceDetailsEvent = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter();
  currentPage = 1;
 
  constructor() {}

  ngOnInit(): void {
  }

  onPageChange(pageNo: number) {
    if (pageNo < 1 || pageNo > this.totalPages) {
      return;
    }
    this.currentPage = pageNo;
    this.paginationEvent.emit(pageNo);
  }

  totalPagesArray(): number[] {
  const numPagesToShow = 5;
  const currentPage = this.currentPage;
  const totalPages = this.totalPages;
  
  let startPage: number;
  let endPage: number;

  if (totalPages <= numPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.floor(numPagesToShow / 2)) {
      startPage = 1;
      endPage = numPagesToShow;
    } else if (currentPage + Math.floor(numPagesToShow / 2) >= totalPages) {
      startPage = totalPages - numPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(numPagesToShow / 2);
      endPage = currentPage + Math.floor(numPagesToShow / 2);
    }
  }

  return Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }

  navigateUpdateDialog(item: any){
    this.navigateUpdateDialogEvent.emit(item);
  }

  navigateDeleteDialog(id: any){
    this.navigateDeleteDialogEvent.emit(id);    
  }

  navigateOrderDetails(id: string) {
    if (this.showOrderDetailButton) {
      this.navigateOrderDetailsEvent.emit(id);
    }
  }

  navigateCreateInvoice(id: string) {
    if (this.showCreateInvoiceButton) {
      this.navigateCreateInvoiceEvent.emit(id);
    }
  }

  navigateInvoiceDetails(id: string) {
    if (this.showInvoiceDetailButton) {
      this.navigateInvoiceDetailsEvent.emit(id);
    }
  }

  isCritical(item: any, fieldName: string): boolean {
    if (fieldName === 'quantity') {
      const criticalField = 'criticalCount';
      return item[fieldName] <= item[criticalField];
    }
    return false;
  }
}
