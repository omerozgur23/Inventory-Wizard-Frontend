import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})


export class MenuComponent {
  @Input() isExpanded = false;
  // @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  

  constructor(
    private loginService: LoginService,
    private router: Router,
    public route: ActivatedRoute,
  ) {}

  // handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  logout(){
    this.loginService.logout();
    this.router.navigate(["/"]);
  }

  // isExpandedd: boolean = false;

  toggleSidebarr() {
    this.isExpanded = !this.isExpanded;
  }
}
