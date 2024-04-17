import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'warehouseManagement-frontend';
  
  private inactivityTimeout = 30 * 1000; // 30 dakika (30 * 60 * 1000)
  private inactivityTimer: any;

  constructor() {
    this.initializeInactivityTimer();
    window.addEventListener('mousemove', () => this.resetInactivityTimer());
    window.addEventListener('keydown', () => this.resetInactivityTimer());
  }

  private initializeInactivityTimer(): void {
    this.inactivityTimer = setTimeout(() => {
      this.clearLocalStorage();
    }, this.inactivityTimeout);
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.initializeInactivityTimer();
  }

  private clearLocalStorage(): void {
    localStorage.clear();
  }
}
