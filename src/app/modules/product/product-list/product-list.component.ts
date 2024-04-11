import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { Product } from '../dto/product';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { UpdateProductDTO } from '../dto/updateProductDTO';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  // productList: Product[] = [];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Kategori', field: 'categoryName' },
    { label: 'Tedarikçi', field: 'supplierCompanyName' },
    { label: 'Alış Fiyatı', field: 'purchasePrice' },
    { label: 'Satış Fiyatı', field: 'unitPrice' },
    { label: 'Kritik Stok', field: '' },
    { label: 'Stok Adedi', field: 'quantity' },
  ];
  
  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ){}

  setSelectedProduct(productId: string) {
    this.id = productId;
  }

  ngOnInit(): void{
    this.loadProducts();
  }
 
  loadProducts() {
    this.productService.getAllProductsByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadProducts();
  }
 
  navigateCreate(){
    this.router.navigate(['./create'], { relativeTo: this.route });
  }

  deleteProduct(id: any){
    this.productService.deleteProduct(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Ürün silinmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  name: string = '';
  search() {
    this.productService.search(this.name).subscribe(products => {
      this.tableData = products;  
    });
  }

  updateProduct(id: string, /*categoryId: string, supplierId: string,*/ productName: string, purchasePrice: number, unitPrice: number ){
    const product = new UpdateProductDTO(id,/* categoryId, supplierId,*/ productName, purchasePrice, unitPrice);
    this.productService.updateProduct(product).subscribe({
      next: (resp) => {
        this.toastr.success('Ürün Güncellenmiştir');
        this.loadProducts();
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
        const productNameValue =  dialog.componentInstance.updateForm.value.values[0];
        const purchasePriceValue =  dialog.componentInstance.updateForm.value.values[1];
        const unitPriceValue =  dialog.componentInstance.updateForm.value.values[2];
        this.updateProduct(item.id,/* item.categoryId, item.supplierId,*/ productNameValue, purchasePriceValue, unitPriceValue);
        }
      }
    });
    dialog.componentInstance.title='Ürün Güncelle';
    dialog.componentInstance.inputLabels=['Ürün Adı', 'Alış Fiyatı', 'Satış Fiyatı'];
    dialog.componentInstance.values.push(new FormControl(item.productName));
    dialog.componentInstance.values.push(new FormControl(item.purchasePrice));
    dialog.componentInstance.values.push(new FormControl(item.unitPrice));
  }

} 
