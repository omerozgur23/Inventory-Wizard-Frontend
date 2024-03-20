import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { Shelf } from '../dto/shelf';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss'
})
export class ShelfListComponent {
  shelfList: Shelf[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  navigateCreateShelf(){
    this.router.navigate(['./shelf-create'], { relativeTo: this.route });
  }

  getShelfs(){
    this.shelfService.getShelf().subscribe({
      next: (result) => {
        this.shelfList = result;
      },
      error: (err) => {
        console.log(err);
        
      }
    });
  }
  ngOnInit(): void {
    this.getShelfs();
  }
}
