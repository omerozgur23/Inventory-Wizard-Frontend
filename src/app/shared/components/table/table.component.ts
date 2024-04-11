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
  @Output() updateEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  

  constructor() {}

  ngOnInit() {
    // this.calculateTotalPages();
  }

  calculateTotalPages() {
    // if (this.tableData && this.tableData.length > 0) {
    //   this.totalPages = Math.ceil(this.tableData.length / this.pageSize);
    // }
  }

  onPageChange(pageNo: number) {
    // this.onPageChangeEvent.emit();
    // if (pageNo >= 1 && pageNo <= this.totalPages) {
    //   this.currentPage = pageNo;
    //   this.onPageChangeEvent.emit(pageNo);
    // }
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

  updateData(item: any){
    this.updateEvent.emit(item);
    console.log(item);
  }
}
