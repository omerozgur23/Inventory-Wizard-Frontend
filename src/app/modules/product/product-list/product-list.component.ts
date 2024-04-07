import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { Product } from '../dto/product';
import { TableColumn } from '../../../shared/components/table/dto/table';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  productList: Product[] = [];
  currentPage: number = 1;
  totalPages: number = 10;
  // tableData: any[] = [];
  // columns: TableColumn[] = [
  //   { label: 'Ürün Adı', field: 'productName' },
  //   { label: 'Kategori', field: 'categoryName' },
  //   { label: 'Tedarikçi', field: 'supplierCompanyName' },
  //   { label: 'Alış Fiyatı', field: 'purchasePrice' },
  //   { label: 'Satış Fiyatı', field: 'unitPrice' },
  //   { label: 'Kritik Stok', field: '' },
  //   { label: 'Stok Adedi', field: 'quantity' },
  // ];

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  // ngOnInit(): void {
  //   this.getProducts();
  // }

  // getProducts() {
  //   this.productService.getProducts().subscribe((customers: any[]) => {
  //     this.tableData = customers;
  //   });
  // }

  ngOnInit(): void{
    // this.productService.getProducts().subscribe({
    //   next: (result) => {
    //     this.productList = result;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });

    // this.productService.getProducts().subscribe(products => {
    //   this.productList = products;  
    // });
    this.loadProducts();
  }
 
  loadProducts() {
    this.productService.getAllProductsByPage(this.currentPage, 2).subscribe(response => {
      this.productList = response;
      // Bu kısımda toplam sayfa sayısını alarak UI'da göstermek için gerekli işlemleri yapabilirsiniz
      // Örneğin: this.totalPages = response.totalPages;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadProducts();
  }

  navigateCreate(){
    this.router.navigate(['./product-create'], { relativeTo: this.route });
  }

  navigateUpdate(){
    this.router.navigate(['./product-update'], { relativeTo: this.route });
  }

  deleteProduct(id: any){
    this.selectedProductId = id;
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
      this.productList = products;  
    });
  }
  
  selectedProductId: string = '';

setSelectedProductForDelete(productId: string) {
  this.selectedProductId = productId;
}

selectedProductName: string = '';
test(productName: string) {
  this.selectedProductName = productName;
}

} 
