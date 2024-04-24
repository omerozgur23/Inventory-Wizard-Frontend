
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../service/category.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormControl  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateCategoryRequest } from '../dto/createCategoryRequest';
import { UpdateCategoryRequest } from '../dto/updateCategoryRequest';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Kategori Kodu', field: 'shortId' },
    { label: 'Kategori Adı', field: 'name' },
  ];


  currentUrl: string = 'Home / Category'
  deleteDialogDescription = 'Kategori kaydını silmek istediğinizden emin misiniz?';
  id = '';
  currentPage: number = 1;
  existingCategoryNames: string[] = [];
  // totalPages: number = 10;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  setSelectedCategory(categoryId: string) {
    this.id = categoryId;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getAllCategoriesByPage(this.currentPage, 18).subscribe(response => {
      this.tableData = this.processData(response)
      console.log(this.tableData);
      
      // this.existingCategoryNames = this.tableData.map(item => item.name);
    });
  }

  processData(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.id.split('-')[0];
      return { ...item, shortId };
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCategory();
  }

  getCategory(){
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateCategoryDialog() {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const categoryNameValue = dialog.componentInstance.createForm.value.values[0];
          if (this.existingCategoryNames.includes(categoryNameValue)) {
            // Kategori adı zaten varsa hata mesajı göster
            this.toastr.error('Bu kategori adı zaten mevcut');
          }else {
            this.createCategory(categoryNameValue);
          }
        }
      }
    });
    dialog.componentInstance.title = 'Yeni Kategori Oluştur';
    dialog.componentInstance.inputLabels = ['Kategori Adı'];
    dialog.componentInstance.values.push(new FormControl(''));
  }

  createCategory(categoryName: string) {
    const category = new CreateCategoryRequest(categoryName);
    this.categoryService.createCategory(category).subscribe({
      next: (resp) => {
        this.toastr.success('Kategori Kaydı Oluşturuldu');
        this.loadCategory();
      },
      error: (err) => {
        // console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }

  openUpdateCategoryDialog(item: any){
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

  updateCategory(id: string, categoryName: string){
    const category = new UpdateCategoryRequest(id, categoryName);
    this.categoryService.updateCategory(category).subscribe({ 
      next: (resp) => {
        this.toastr.success('Kategori Güncellenmiştir');
        this.loadCategory();
      },
      error: (err) => {
        // console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteCategory(id: any){
    this.categoryService.deleteCategory(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Kategori silinmiştir")
          this.loadCategory();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
