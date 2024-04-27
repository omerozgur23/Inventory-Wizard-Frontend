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
import { PdfService } from '../../../core/service/pdf.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: "Kategori Kodu", field: 'shortId' },
    { label: 'Kategori Adı', field: 'name' },
  ];

  tableTitle = 'Kategoriler'
  deleteDialogDescription = 'Kategori kaydını silmek istediğinizden emin misiniz?';
  id = '';
  currentPage = 1;
  existingCategoryNames: string[] = [];
  // totalPages: number = 10;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService,
  ){}

  setSelectedCategory(categoryId: string) {
    this.id = categoryId;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getCategoriesByPage(this.currentPage, 18).subscribe({
      next: (result) => {
        this.tableData = this.uuidSplit(result)
        console.log(this.tableData);
      },
      error: (err) => {
        console.log(err);
      }
      // this.existingCategoryNames = this.tableData.map(item => item.name);
    });
  } 

  uuidSplit(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.id.split('-')[0];
      return { ...item, shortId };
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCategory();
  }

  getAllCategory(){
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

    dialog.componentInstance.title = 'Yeni Kategori Oluştur';
    dialog.componentInstance.inputLabels = ['Kategori Adı'];
    dialog.componentInstance.values.push(new FormControl(''));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {            
            const categoryNameValue = dialog.componentInstance.createForm.value.values[0];
            this.createCategory(categoryNameValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createCategory(categoryName: string) {
    const category = new CreateCategoryRequest(categoryName);
    this.categoryService.createCategory(category).subscribe({
      next: (result) => {
        this.toastr.success('Kategori Kaydı Oluşturuldu');
        this.loadCategory();
      },
      error: (err) => {
        console.log(err);
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

    dialog.componentInstance.title='Kategori Güncelle';
    dialog.componentInstance.inputLabels=['Kategori Adı'];
    dialog.componentInstance.values.push(new FormControl(item.name));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const nameValue =  dialog.componentInstance.updateForm.value.values[0];
        this.updateCategory(item.id, nameValue);
        }
      }
    });    
  }

  updateCategory(id: string, categoryName: string){
    const category = new UpdateCategoryRequest(id, categoryName);
    this.categoryService.updateCategory(category).subscribe({ 
      next: (result) => {
        this.toastr.success('Kategori Güncellenmiştir');
        this.loadCategory();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteCategory(id: any){
    this.categoryService.deleteCategory(id).subscribe(
      {
        next: (result) =>{
          this.toastr.success("Kategori silinmiştir")
          this.loadCategory();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  generatePDF() {
    const fileName = 'categories.pdf';
    const tableTitle = 'Kategori Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.categoryService.search(searchKeyword).subscribe({
          next: (result) => {
            this.tableData = this.uuidSplit(result);
          },
          error: (err) => {
            console.log(err);
          }
        }),
        300
      );
    } else {
      this.loadCategory();
    }
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
