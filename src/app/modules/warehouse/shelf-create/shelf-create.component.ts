import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shelf-create',
  templateUrl: './shelf-create.component.html',
  styleUrl: './shelf-create.component.scss'
})
export class ShelfCreateComponent {


  shelfForm = this.fb.group({
    count: 0,
    capacity:''
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  submit(){
    this.shelfService.createShelf(this.shelfForm.value).subscribe({
      next: (resp) => {
        this.toastr.success('Shelf Oluşturulmuştur');
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

}
