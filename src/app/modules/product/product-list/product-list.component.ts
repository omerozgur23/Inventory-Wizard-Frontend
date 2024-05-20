import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateProductRequest } from '../dto/createProductRequest';
import { CategoryService } from '../../category/service/category.service';
import { Router } from '@angular/router';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { SupplierService } from '../../supplier/service/supplier.service';
import { AuthService } from '../../../core/service/auth.service';
import { SearchProductRequest } from '../dto/searchProductRequest';
import { DeleteProductRequest } from '../dto/deleteProductRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { Validators } from '@angular/forms';

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
    private router: Router,
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
    this.productService.getProductsByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
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
            const categoryIdValue = formValues[4].categoryDropdownValue.id;
            const supplierIdValue = formValues[5].supplierDropdownValue.id;

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
      dialog.componentInstance.categoryDropdownOptions = this.categoryList;
      dialog.componentInstance.supplierDropdownOptions = this.supplierList;
      dialog.componentInstance.addInput(item.productName, [Validators.required]);
      dialog.componentInstance.addInput(item.criticalCount, [Validators.required, Validators.min(0)]);
      dialog.componentInstance.addInput(item.purchasePrice, [Validators.required, Validators.min(0)]);
      dialog.componentInstance.addInput(item.unitPrice, [Validators.required, Validators.min(0)]);
      dialog.componentInstance.addCategoryDropdown();
      dialog.componentInstance.addSupplierDropdown();

      dialog.afterClosed().subscribe({
        next: (data) => {
          if (data?.result === 'yes') {
          const productNameValue =  dialog.componentInstance.updateForm.value.values[0].inputValue;
          const criticalCountValue =  dialog.componentInstance.updateForm.value.values[1].inputValue;
          const purchasePriceValue =  dialog.componentInstance.updateForm.value.values[2].inputValue;
          const unitPriceValue =  dialog.componentInstance.updateForm.value.values[3].inputValue;
          const categoryIdValue =  dialog.componentInstance.updateForm.value.values[4].categoryDropdownValue.id;
          const supplierIdValue =  dialog.componentInstance.updateForm.value.values[5].supplierDropdownValue.id;
          this.updateProduct(item.id, productNameValue, criticalCountValue, purchasePriceValue, unitPriceValue, categoryIdValue, supplierIdValue);
          }
        }
      });
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }

  updateProduct(id: string, productName: string, criticalCount: number, purchasePrice: number, unitPrice: number, categoryId: string, supplierId: string ){
    const successUpdatedMessage = this.translateService.instant("productUpdatedMessage");
    const product = new UpdateProductRequest(id, productName, criticalCount, purchasePrice, unitPrice, categoryId, supplierId);
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
      const product = new DeleteProductRequest(id);
      this.productService.deleteProduct(product).subscribe(
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
      const keyword = new SearchProductRequest(searchKeyword);
      setTimeout(() => 
        this.productService.search(keyword).subscribe({
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
      this.loadProducts();
    }
  }
}
