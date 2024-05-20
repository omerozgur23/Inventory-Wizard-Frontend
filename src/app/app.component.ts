import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private translateService: TranslateService,
  ){
    this.translateService.setDefaultLang("en");
    this.translateService.use(localStorage.getItem("lang") || "en");
    // this.initializeInactivityTimer();
    // window.addEventListener('mousemove', () => this.resetInactivityTimer());
    // window.addEventListener('keydown', () => this.resetInactivityTimer());
  }

  title = 'warehouseManagement-frontend';
  
  // private inactivityTimeout = /* 30 * 1000 */ 30 * 60 * 1000; // 30 dakika (30 * 60 * 1000)
  // private inactivityTimer: any;

  // private initializeInactivityTimer(): void {
  //   this.inactivityTimer = setTimeout(() => {
  //     this.clearLocalStorage();
  //   }, this.inactivityTimeout);
  // }

  // private resetInactivityTimer(): void {
  //   clearTimeout(this.inactivityTimer);
  //   this.initializeInactivityTimer();
  // }

  // private clearLocalStorage(): void {
  //   localStorage.clear();
  // }
}
