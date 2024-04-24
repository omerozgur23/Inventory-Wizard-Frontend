import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn } from './dto/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
  @Input() tableData: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Output() navigateCreateDialogEvent = new EventEmitter();
  @Output() navigateUpdateDialogEvent = new EventEmitter<any>();
  @Output() navigateDeleteDialogEvent = new EventEmitter<any>();
  @Output() navigateAcceptProductEvent = new EventEmitter<any>();
  @Output() navigateOrderDetailsEvent = new EventEmitter<any>();
  @Output() navigateSettingsEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  @Output() paginationEvent = new EventEmitter();
  @Input() showAcceptProductButton: boolean = false;
  @Input() showOrderDetailButton = false;
  @Input() currentUrl = '';
  currentPage = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = this.router.url; // Mevcut URL'i al
      });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.paginationEvent.emit(pageNo);
  }

  refresh(){
    this.refreshEvent.emit();
  }

  navigateCreateDialog() {
    this.navigateCreateDialogEvent.emit();
  }

  navigateUpdateDialog(item: any){
    this.navigateUpdateDialogEvent.emit(item);
    console.log(item);
  }

  navigateDeleteDialog(id: any){
    this.navigateDeleteDialogEvent.emit(id);    
  }

  navigateAcceptProduct() {
    if (this.showAcceptProductButton) {
      this.navigateAcceptProductEvent.emit();
    }
  }
  
  navigateOrderDetails(id: string) {
    if (this.showOrderDetailButton) {
      console.log(id);
      this.navigateOrderDetailsEvent.emit(id);
    }
  }

  navigateSettings(){
    this.navigateSettingsEvent.emit();
  }

  isCritical(item: any, fieldName: string): boolean {
    if (fieldName === 'quantity') {
      const criticalField = 'criticalCount';
      return item[fieldName] <= item[criticalField];
    }
    return false;
  }
  

}
