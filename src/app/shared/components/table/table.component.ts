import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumn } from './dto/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';
import { debounceTime } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{
  @Input() tableData: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() showAcceptProductButton: boolean = false;
  @Input() showOrderDetailButton = false;
  @Input() tableTitle = '';
  @Output() navigateCreateDialogEvent = new EventEmitter();
  @Output() navigateUpdateDialogEvent = new EventEmitter<any>();
  @Output() navigateDeleteDialogEvent = new EventEmitter<any>();
  @Output() navigateAcceptProductEvent = new EventEmitter<any>();
  @Output() navigateOrderDetailsEvent = new EventEmitter<any>();
  @Output() navigateSettingsEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  @Output() paginationEvent = new EventEmitter();
  @Output() generatePdfEvent = new EventEmitter();
  @Output() onSearchInputChangeEvent = new EventEmitter<any>();
  private searchKeywordChange = new Subject<string>();

  lang = "";
  currentPage = 1;

  constructor(
    // private router: Router,
    // private route: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.searchKeywordChange.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.onSearchInputChange(value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem("lang") || "en";

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

  generatePDF(){
    this.generatePdfEvent.emit();
  }
  
  handleSearchInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target instanceof HTMLInputElement) {
      const keyword = target.value;
      this.searchKeywordChange.next(keyword);
    }
  }

  onSearchInputChange(keyword: string) {
    this.onSearchInputChangeEvent.emit(keyword);
  }

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang', selectedLanguage);

    this.translateService.use(selectedLanguage);
  }
}
