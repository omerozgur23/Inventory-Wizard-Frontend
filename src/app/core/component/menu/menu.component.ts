import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent {
  @Input() isExpanded = false;
  isMobileView: boolean = false;
  
  constructor(
    private loginService: LoginService,
    private router: Router,
    public route: ActivatedRoute,
    
  ) {

    this.checkScreenSize();
  }

  logout(){
    this.loginService.logout();
    this.router.navigate(["/"]);
  }

  toggleSidebarr() {
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
  }
}
