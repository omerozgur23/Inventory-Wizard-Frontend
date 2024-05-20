import { UpdateModalComponent } from './../../../shared/components/update-modal/update-modal.component';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { ProductService } from '../../product/service/product.service';
import { AcceptProductModalComponent } from '../../../shared/components/accept-product-modal/accept-product-modal.component';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/service/auth.service';
import { SearchShelfRequest } from '../dto/searchShelfRequest';
import { DeleteShelfRequest } from '../dto/deleteShelfRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss'
})
export class ShelfListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'shelfTableShelfCode', field: 'shortId' },
    { label: 'shelfTableProductName', field: 'productName' },
    { label: 'shelfTableProductQuantity', field: 'count' },
    { label: 'shelfTableCapacity', field: 'capacity' },
  ];

  tableTitle = "shelfTableTitle"
  productList: any[] = [];
  deleteDialogDescription = 'deleteShelfDialogDescription';
  id = '';
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;
  acceptProductForm = this.fb.group({
    productId: '',
    count: 0,
  });

  constructor(
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private productService: ProductService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ){}

  setSelectedShelf(shelfId: string) {
    this.id = shelfId;
  }

  ngOnInit(): void { 
    this.loadShelves();
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.productList = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadShelves() {
    this.shelfService.getShelvesByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
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
    this.loadShelves();
  }

  getAllShelves(){
    this.shelfService.getAllShelves().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateShelfDialog(){
    if (this.authService.isAdmin()) {
      let dialog = this.dialog.open(CreateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title = 'createShelfTitle';
      dialog.componentInstance.inputLabels = ['shelfTableCapacity', 'shelfInputsPeace'];
      for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
        dialog.componentInstance.addInput();
      }

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
            const formValues = dialog.componentInstance.createForm.value.values;
            const capacityValue = formValues[0].inputValue;
            const countValue = formValues[1].inputValue;
            this.createShelf(capacityValue, countValue);
          }
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  createShelf(capacity: number, count: number){
    const successCreatedMessage = this.translateService.instant("shelfCreatedMessage");
    const errorCapacityMessage = this.translateService.instant("createShelfErrorCapacity");
    const errorCountMessage = this.translateService.instant("createShelfErrorCount");
    const shelf = new CreateShelfRequest(capacity, count);
    this.shelfService.createShelf(shelf).subscribe({
      next: (resp) => {
        this.toastr.success(successCreatedMessage);
        this.loadShelves();
      },
      error: (err) => {    
        if (capacity > 10) {
          this.toastr.error(errorCapacityMessage);
        }if (count > 10) {
          this.toastr.info(errorCountMessage)
        }
        console.log(err);
      }
    });
  }

  openUpdateShelfDialog(item: any){
    if (this.authService.isAdmin()) {
      let dialog =  this.dialog.open(UpdateModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
      });

      dialog.componentInstance.title='updateShelfTitle';
      dialog.componentInstance.inputLabels=['shelfTableCapacity'];
      dialog.componentInstance.addInput(item.capacity, [Validators.required, Validators.max(10), Validators.min(0)]);

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
          const capacityValue = dialog.componentInstance.updateForm.value.values[0].inputValue;
          this.updateShelf(item.id, capacityValue);
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

  updateShelf(id: string, capacity: number){
    const successUpdatedMessage = this.translateService.instant("shelfUpdatedMessage");
    const errorCapacityMessage = this.translateService.instant("createShelfErrorCapacity");
    const shelf = new UpdateShelfRequest(id, capacity)
    this.shelfService.updateShelf(shelf).subscribe({
      next: (result) => {
        this.toastr.success(successUpdatedMessage);
        this.loadShelves();
      },
      error: (err) => {
        if (capacity > 10) {
          this.toastr.error(errorCapacityMessage)
        }
        console.log(err);
      }
    })
  }
  
  deleteShelf(id: any){
    if (this.authService.isAdmin()) {
      const successDeletedMessage = this.translateService.instant("shelfDeletedMessage");
      const shelf = new DeleteShelfRequest(id);
      this.shelfService.deleteShelf(shelf).subscribe(
        {
          next: () =>{
            this.toastr.success(successDeletedMessage)
            this.ngOnInit();
          },
          error: () => {
            this.genericService.showError("errorMessage");
          }
        }
      );
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  openAcceptProductDialog(item: any) {
    if (this.authService.isAdmin() || this.authService.isWarehouseSupervisor()) {
      const dialogRef = this.dialog.open(AcceptProductModalComponent, {
        width: '500px',
        enterAnimationDuration: '400ms',
        exitAnimationDuration: '250ms',
        data : {
          title: 'acceptProductTitle', 
          productList: this.productList,
        }
      });
  
      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
            const formValue = data.formValue;
            this.acceptProduct(formValue);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else{
      this.genericService.showAuthError("authorizationError");
    }
  }
  

  acceptProduct(formValue: any) {
    const successAcceptProductMessage = this.translateService.instant("successAcceptProductMessage");
    this.shelfService.acceptProduct(formValue).subscribe({
      next: (result) => {
        this.toastr.success(successAcceptProductMessage);
        this.loadShelves();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    });
  }

  generatePDF() {
    const fileName = 'shelves.pdf';
    const tableTitle = this.translateService.instant("shelfPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      const keyword = new SearchShelfRequest(searchKeyword);
      setTimeout(() => 
        this.shelfService.search(keyword).subscribe({
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
      this.loadShelves();
    }
  }
}