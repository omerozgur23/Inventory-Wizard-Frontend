import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from './dto/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() tableData: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Output() navigateCreateEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();

  currentPage: number = 1;
  totalPages: number = 10;

  constructor() {}

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    // this.loadProducts();
  }

  refresh(){
    this.refreshEvent.emit();
  }

  navigateCreate() {
    this.navigateCreateEvent.emit();
  }

  deleteData(id: any){
    this.deleteEvent.emit(id);
  }
}
