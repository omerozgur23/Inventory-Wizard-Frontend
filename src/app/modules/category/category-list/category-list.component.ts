import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  // categoryList: Category[] = [];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Kategori Adı', field: 'name' },
  ];
  categoryForm = this.fb.group({
    categoryName: ''
  });


  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((categories: any[]) => {
      this.tableData = categories;
    });
  }

  navigateCreate(){
    this.router.navigate(['./category-create'], { relativeTo: this.route });
  }

  // navigateCreateCategory(){
  //   this.router.navigate(['./category-create'], { relativeTo: this.route });
  // }
 
  // getCategory(){
  //   this.categoryService.getCategory().subscribe({
  //     next: (result) => {
  //       this.categoryList = result;
  //     },
  //     error: (err) => {
  //       console.log(err);
        
  //     }
  //   });
  // }
  
  updateCategory(id: any){
    this.categoryService.updateCategory(id, this.categoryForm.value).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Kategori güncellenmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
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
  selectedCategoryId: string = '';

  setSelectedCategoryForDelete(categoryId: string) {
    this.selectedCategoryId = categoryId;
  }
}
