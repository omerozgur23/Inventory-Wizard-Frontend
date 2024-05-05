import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  constructor(
    private translateService: TranslateService,
    private router: Router,
  ){
    this.searchKeywordChange.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.onSearchInputChange(value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  @Input() showAcceptProductButton = false;
  @Output() navigateCreateDialogEvent = new EventEmitter();
  @Output() navigateAcceptProductEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  @Output() generatePdfEvent = new EventEmitter();
  @Output() onSearchInputChangeEvent = new EventEmitter<any>();
  private searchKeywordChange = new Subject<string>();
  lang = '';

  ngOnInit(): void {
    this.lang = localStorage.getItem("lang") || "en";
  }

  refresh() {
    this.refreshEvent.emit();
  }

  navigateCreateDialog() {
    this.navigateCreateDialogEvent.emit();
  }

  navigateAcceptProduct() {
    if (this.showAcceptProductButton) {
      this.navigateAcceptProductEvent.emit();
    }
  }

  navigateSettings() {
    this.router.navigate(['/home/settings']);
  }

  generatePDF() {
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

  changeLang(lang: any) {
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang', selectedLanguage);

    this.translateService.use(selectedLanguage);
  }
}
