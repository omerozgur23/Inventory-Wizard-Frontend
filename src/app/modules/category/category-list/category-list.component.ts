import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../service/category.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateCategoryRequest } from '../dto/createCategoryRequest';
import { UpdateCategoryRequest } from '../dto/updateCategoryRequest';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../../core/service/generic.service';
import { AuthService } from '../../../core/service/auth.service';
import { DeleteCategoryRequest } from '../dto/deleteCategoryRequest';
import { SearchCategoryRequest } from '../dto/searchCategoryRequest';
import { PaginationRequest } from '../dto/paginationRequest';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: "categoryTableCategoryCode", field: 'shortId' },
    { label: 'categoryTableCategoryName', field: 'categoryName' }, 
  ];

  tableTitle = 'categoryTableTitle'
  deleteDialogDescription = 'deleteCategoryDialogDescription';
  id = '';
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ){}

  setSelectedCategory(categoryId: string) {
    this.id = categoryId;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getCategoriesByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data)
        this.totalShelvesCount = result.count;
        this.totalPages = Math.ceil(this.totalShelvesCount / this.itemPerPage) 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadCategory();
  }

  getAllCategory(){
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateCategoryDialog() {
    if (this.authService.isAdmin()) {
      let dialog = this.dialog.open(CreateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title = 'createCategoryTitle';
      dialog.componentInstance.inputLabels = ['categoryTableCategoryName'];
      for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
        dialog.componentInstance.addInput();
      }

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
            const formValues = dialog.componentInstance.createForm.value.values;
            const categoryNameValue = formValues[0].inputValue;
            this.createCategory(categoryNameValue);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  createCategory(categoryName: string) {
    const successCreatedMessage = this.translateService.instant('categoryCreatedMessage');
    const category = new CreateCategoryRequest(categoryName);
    this.categoryService.createCategory(category).subscribe({
      next: (result) => {
        this.toastr.success(successCreatedMessage);
        this.loadCategory();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    });
  }

  openUpdateCategoryDialog(item: any){
    if (this.authService.isAdmin()) {
      let dialog =  this.dialog.open(UpdateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title='updateCategoryTitle';
      dialog.componentInstance.inputLabels=['categoryTableCategoryName'];
      dialog.componentInstance.addInput(item.categoryName, [Validators.required, Validators.minLength(2)]);

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
          const nameValue =  dialog.componentInstance.updateForm.value.values[0].inputValue;
          this.updateCategory(item.id, nameValue);
          }
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  updateCategory(id: string, categoryName: string){
    const successUpdatedMessage = this.translateService.instant('categoryUpdatedMessage');
    const category = new UpdateCategoryRequest(id, categoryName);
    this.categoryService.updateCategory(category).subscribe({ 
      next: (result) => {
        this.toastr.success(successUpdatedMessage);
        this.loadCategory();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    })
  }

  deleteCategory(id: any){
    if (this.authService.isAdmin()) {
      const successDeletedMessage = this.translateService.instant('categoryDeletedMessage');
      const category = new DeleteCategoryRequest(id);
      this.categoryService.deleteCategory(category).subscribe(
        {
          next: (result) =>{
            this.toastr.success(successDeletedMessage)
            this.loadCategory();
          },
          error: (err) => {
            console.log(err);
            this.genericService.showError("errorMessage");
          }
        }
      );
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  generatePDF() {
    const fileName = 'categories.pdf';
    const tableTitle = this.translateService.instant('categoryPdfTitle');
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      const keyword = new SearchCategoryRequest(searchKeyword);
      setTimeout(() => 
        this.categoryService.search(keyword).subscribe({
          next: (result) => {
            this.tableData = this.genericService.uuidSplit(result.data);
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
}
