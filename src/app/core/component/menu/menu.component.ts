import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})


export class MenuComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  constructor(
    private loginService: LoginService,
    private router: Router,
    public route: ActivatedRoute,
  ) {}

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  logout(){
    this.loginService.logout();
    this.router.navigate(["/"]);
  }
}
