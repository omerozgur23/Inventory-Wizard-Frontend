import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  constructor(
    private router: Router,
    public route: ActivatedRoute,
  ) {}

  redirectToMenu() {
    this.router.navigate(['/home']);
  }
  
}
