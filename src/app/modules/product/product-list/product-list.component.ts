import { GetCategoryResponse } from './../../category/dto/getCategoryResponse';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateProductRequest } from '../dto/createProductRequest';
import { CategoryService } from '../../category/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';

import { TestDialogComponent } from '../../../shared/components/test-dialog/test-dialog.component';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { SupplierService } from '../../supplier/service/supplier.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'productTableProductCode', field: 'shortId' },
    { label: 'productTableProductName', field: 'productName' },
    { label: 'productTableCategory', field: 'categoryName' },
    { label: 'productTableSupplier', field: 'supplierCompanyName' },
    { label: 'productTablePurchasePrice', field: 'purchasePrice' },
    { label: 'productTableUnitPrice', field: 'unitPrice' },
    { label: 'productTableCriticalStock', field: 'criticalCount' },
    { label: 'productTableQuantity', field: 'quantity' },
  ];

  tableTitle = "productTableTitle"
  categoryList: any[] = [];
  supplierList: any[] = []; 
  deleteDialogDescription = 'deleteProductDialogDescription';
  id = '';
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ){}

  setSelectedProduct(productId: string) {
    this.id = productId;
  }

  ngOnInit(): void{
    this.loadProducts();
    this.getAllCategory();
    this.getAllSupplier();
  }
 
  loadProducts() {
    this.productService.getProductsByPage(this.currentPage, this.itemPerPage).subscribe({
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
    this.loadProducts();
  }

  getAllProduct(){
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.tableData = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllCategory(){
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        this.categoryList = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllSupplier(){
    this.supplierService.getAllSuppliers().subscribe({
      next: (result) => {
        this.supplierList = result.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateProductDialog() {
    if (this.authService.isAdmin()) {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });
    
    dialog.componentInstance.title = 'createProductTitle';
    dialog.componentInstance.inputLabels = ['productTableProductName', 'productTableCriticalStock', 'productTablePurchasePrice', 'productTableUnitPrice'];
    dialog.componentInstance.categoryDropdownOptions = this.categoryList;
    dialog.componentInstance.supplierDropdownOptions = this.supplierList;
    for (let i = 0; i < dialog.componentInstance.inputLabels.length; i++) {
      dialog.componentInstance.addInput();
    };
    dialog.componentInstance.addCategoryDropdown();
    dialog.componentInstance.addSupplierDropdown();

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const formValues = dialog.componentInstance.createForm.value.values;
          const productNameValue = formValues[0].inputValue;
          const criticalCountValue = formValues[1].inputValue;
          const purchasePriceValue = formValues[2].inputValue;
          const unitPriceValue = formValues[3].inputValue;
          const categoryIdValue = formValues[4].categoryDropdownValue;
          const supplierIdValue = formValues[5].supplierDropdownValue;
          
          this.createProduct(productNameValue, categoryIdValue, supplierIdValue, criticalCountValue, purchasePriceValue, unitPriceValue);
        }
      },
      error: (err) => {
        console.log("Dialog Hatası " + err);
        
      }
    });
  }
  else {
    this.genericService.showAuthError("authorizationError");
  }
  }

  createProduct(productname: string, categoryId: string, supplierId: string, criticalCount: number, purchasePrice: number, unitPrice: number) {
    const successCreatedMessage = this.translateService.instant("productCreatedMessage");
    const product = new CreateProductRequest(productname, categoryId, supplierId, criticalCount, purchasePrice, unitPrice);
    this.productService.createProduct(product).subscribe({
      next: (resp) => {
        this.toastr.success(successCreatedMessage);
        this.loadProducts();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    });
  }

  openUpdateProductDialog(item: any){
      if (this.authService.isAdmin()) {
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title='updateProductTitle';
    dialog.componentInstance.inputLabels=['productTableProductName', 'productTableCriticalStock', 'productTablePurchasePrice', 'productTableUnitPrice'];
    dialog.componentInstance.values.push(new FormControl(item.productName));
    dialog.componentInstance.values.push(new FormControl(item.criticalCount));
    dialog.componentInstance.values.push(new FormControl(item.purchasePrice));
    dialog.componentInstance.values.push(new FormControl(item.unitPrice));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const productNameValue =  dialog.componentInstance.updateForm.value.values[0];
        const criticalCountValue =  dialog.componentInstance.updateForm.value.values[1];
        const purchasePriceValue =  dialog.componentInstance.updateForm.value.values[2];
        const unitPriceValue =  dialog.componentInstance.updateForm.value.values[3];
        this.updateProduct(item.id,/* item.categoryId, item.supplierId,*/ productNameValue, criticalCountValue, purchasePriceValue, unitPriceValue);
        }
      }
    });
  }
  else {
    this.genericService.showAuthError("authorizationError");
  }
  }

  updateProduct(id: string, /*categoryId: string, supplierId: string,*/ productName: string, criticalCount: number, purchasePrice: number, unitPrice: number ){
    const successUpdatedMessage = this.translateService.instant("productUpdatedMessage");
    const product = new UpdateProductRequest(id,/* categoryId, supplierId,*/ productName, criticalCount, purchasePrice, unitPrice);
    this.productService.updateProduct(product).subscribe({
      next: (result) => {
        this.toastr.success(successUpdatedMessage);
        this.loadProducts();
      },
      error: (err) => {
        console.log(err);
        this.genericService.showError("errorMessage");
      }
    })
  }

  deleteProduct(id: any){
      if (this.authService.isAdmin()) {
    const successDeletedMessage = this.translateService.instant("productDeletedMessage");
    this.productService.deleteProduct(id).subscribe(
      {
        next: (result) =>{
          this.toastr.success(successDeletedMessage)
          this.ngOnInit();
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

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }

  generatePDF() {
    const fileName = 'products.pdf';
    const tableTitle = this.translateService.instant("productPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.productService.search(searchKeyword).subscribe({
          next: (result) => {
            this.tableData = this.genericService.uuidSplit(result);
          },
          error: (err) => {
            console.log(err);
          }
        }),
        300
      );
    } else {
      this.loadProducts();
    }
  }


  openTestCreateProductDialog() {
    if (this.authService.isAdmin()) {
     let dialog = this.dialog.open(TestDialogComponent, {
       width: '500px',
       enterAnimationDuration: '400ms',
       exitAnimationDuration: '250ms',
     });
    
     dialog.componentInstance.title = 'createProductTitle';
     dialog.componentInstance.inputLabels = ['productTableProductName', 'productTableCriticalStock', 'productTablePurchasePrice', 'productTableUnitPrice'];
     dialog.componentInstance.categoryDropdownOptions = this.categoryList;
     dialog.componentInstance.supplierDropdownOptions = this.supplierList;
     for (let i = 0; i < 4; i++) {
       dialog.componentInstance.addInput();
     }
     dialog.componentInstance.addSupplierDropdown();
     dialog.componentInstance.addCategoryDropdown();
    
     dialog.afterClosed().subscribe({
       next: (data) => {
         if (data?.result === 'yes') {
           const formValues = dialog.componentInstance.createTestForm.value.values;
           const productNameValue = formValues[0].inputValue;
           const criticalCountValue = formValues[1].inputValue;
           const purchasePriceValue = formValues[2].inputValue;
           const unitPriceValue = formValues[3].inputValue;
           const supplierIdValue = formValues[4].supplierDropdownValue;
           const categoryIdValue = formValues[5].categoryDropdownValue;
           
           this.createProduct(productNameValue, categoryIdValue, supplierIdValue, criticalCountValue, purchasePriceValue, unitPriceValue);
         }
       },
       error: (err) => {
         console.log("Dialog Hatası " + err);
        }
     });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }
}
