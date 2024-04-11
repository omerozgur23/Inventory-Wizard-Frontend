import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, Validators, FormControl  } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Kategori Adı', field: 'name' },
  ];

  // categoryForm = this.fb.group({
  //   categoryName: ['', Validators.required],
  // });

  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private location: Location,
  ){}

  setSelectedCategory(categoryId: string) {
    this.id = categoryId;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getAllCategoriesByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCategory();
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((categories: any[]) => {
      this.tableData = categories;
    });
  }
  
  create() {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
  
    dialogRef.componentInstance.title = 'Kategori Ekle';
    dialogRef.componentInstance.inputLabels = ['Kategori Adı'];
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.result === 'yes') {
        const categoryName = result.createForm.value.values[0];

        this.categoryService.createCategory(categoryName).subscribe(
          (response) => {
            this.toastr.success('Kategori başarıyla oluşturuldu');
            this.loadCategory();
          },
          (error) => {
            console.error('Kategori oluşturma hatası:', error);
            this.toastr.error('Kategori oluşturulurken bir hata oluştu');
          }
        );
      }
    });
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

  updateCategory(id: string, categoryName: string){
    this.categoryService.updateCategory(id, categoryName).subscribe({
      next: (resp) => {
        this.toastr.success('Kategori Güncellenmiştir');
        this.loadCategory();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  update(item: any){
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });


    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const nameValue =  dialog.componentInstance.updateForm.value.values[0];
        this.updateCategory(item.id, nameValue);
        }
      }
    });
    dialog.componentInstance.title='Kategori Güncelle';
    dialog.componentInstance.inputLabels=['Kategori Adı'];
    dialog.componentInstance.values.push(new FormControl(item.name));
  }
}
