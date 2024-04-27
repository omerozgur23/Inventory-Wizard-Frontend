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
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Ürün Kodu', field: 'shortId' },
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Kategori', field: 'categoryName' },
    { label: 'Tedarikçi', field: 'supplierCompanyName' },
    { label: 'Alış Fiyatı', field: 'purchasePrice' },
    { label: 'Satış Fiyatı', field: 'unitPrice' },
    { label: 'Kritik Stok', field: 'criticalCount' },
    { label: 'Stok Adedi', field: 'quantity' },
  ];

  tableTitle = "Ürünler"
  categoryList: GetCategoryResponse[] = [];
  deleteDialogDescription = 'Ürün kaydını silmek istediğinizden emin misiniz?';
  id = '';
  currentPage: number = 1; 
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService,
  ){}

  setSelectedProduct(productId: string) {
    this.id = productId;
  }

  ngOnInit(): void{
    this.loadProducts();
    // this.getAllCategory();
  }
 
  loadProducts() {
    this.productService.getProductsByPage(this.currentPage, 18).subscribe({
      next: (result) => {
        this.tableData = this.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
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
    this.loadProducts();
  }

  getAllProduct(){
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllCategory(){
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        this.categoryList = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showDropdown = true;
  openCreateProductDialog() {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });    
    dialog.componentInstance.showDropdown = this.showDropdown;
    dialog.componentInstance.title = 'Yeni Ürün Oluştur';
    dialog.componentInstance.inputLabels = ['Ürün Adı', 'Tedarikçi', 'Kritik Stok', 'Alış Fiyatı', 'Satış Fiyatı'];
    dialog.componentInstance.dropdownOptions = this.categoryList;
    // dialog.componentInstance.values.push(new FormControl(''));
    // dialog.componentInstance.values.push(new FormControl(''));
    // dialog.componentInstance.values.push(new FormControl(''));
    // dialog.componentInstance.values.push(new FormControl(''));
    // dialog.componentInstance.values.push(new FormControl(''));
    for (let i = 0; i < 5; i++) {
      dialog.componentInstance.values.push(new FormControl(''));
    }

    const dropdownFormControl = new FormControl(''); // Varsayılan olarak seçili değer boş

  // Dropdown'daki seçimlerin değiştiğini izleyelim
  dropdownFormControl.valueChanges.subscribe((categoryId) => {
    console.log("Seçilen kategori ID: " + categoryId);

  });

  // Yeni oluşturduğumuz dropdown FormControl'ü dialog'a ekleyelim
  dialog.componentInstance.values.push(dropdownFormControl);
    
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const formValues = dialog.componentInstance.createForm.value.values;
          const productNameValue = formValues[0];
          const supplierIdValue = formValues[1];
          const criticalCountValue = formValues[2];
          const purchasePriceValue = formValues[3];
          const unitPriceValue = formValues[4];
          const categoryIdValue = formValues[5];
          console.log("categoryId: " + categoryIdValue);
          
          this.createProduct(productNameValue, categoryIdValue, supplierIdValue, criticalCountValue, purchasePriceValue, unitPriceValue);
        }
      },
      error: (err) => {
        console.log("Dialog Hatası " + err);
        
      }
    });
    
  }

  createProduct(productname: string, categoryId: string, supplierId: string, criticalCount: number, purchasePrice: number, unitPrice: number) {
    const product = new CreateProductRequest(productname, categoryId, supplierId, criticalCount, purchasePrice, unitPrice);
    this.productService.createProduct(product).subscribe({
      next: (resp) => {
        this.toastr.success('Ürün Oluşturuldu');
        this.loadProducts();
      },
      error: (err) => {
        // console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }

  openUpdateProductDialog(item: any){
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title='Ürün Güncelle';
    dialog.componentInstance.inputLabels=['Ürün Adı', 'Kritik Stok', 'Alış Fiyatı', 'Satış Fiyatı'];
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

  updateProduct(id: string, /*categoryId: string, supplierId: string,*/ productName: string, criticalCount: number, purchasePrice: number, unitPrice: number ){
    const product = new UpdateProductRequest(id,/* categoryId, supplierId,*/ productName, criticalCount, purchasePrice, unitPrice);
    this.productService.updateProduct(product).subscribe({
      next: (result) => {
        this.toastr.success('Ürün Güncellenmiştir');
        this.loadProducts();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }

  deleteProduct(id: any){
    this.productService.deleteProduct(id).subscribe(
      {
        next: (result) =>{
          this.toastr.success("Ürün silinmiştir")
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }

  generatePDF() {
    const fileName = 'products.pdf';
    const tableTitle = 'Ürün Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.productService.search(searchKeyword).subscribe({
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
      this.loadProducts();
    }
  }
}
