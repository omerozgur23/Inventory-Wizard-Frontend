import { Component } from '@angular/core';
import { Category } from '../../product/dto/category';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  categoryList: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  navigateCreateCategory(){
    this.router.navigate(['./category-create'], { relativeTo: this.route });
  }

  getCategory(){
    this.categoryService.getCategory().subscribe({
      next: (result) => {
        this.categoryList = result;
      },
      error: (err) => {
        console.log(err);
        
      }
    });
  }
  ngOnInit(): void {
    this.getCategory();
  }

  deleteCategory(id: any){
    this.categoryService.deleteCategory(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Kategori silinmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }
}
