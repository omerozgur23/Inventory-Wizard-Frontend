import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { UpdateProductRequest } from '../dto/updateProductRequest';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateModalComponent } from '../../../shared/components/update-modal/update-modal.component';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateProductRequest } from '../dto/createProductRequest';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

import pdfMake from "pdfmake/build/pdfmake";
import  pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{
  // productList: Product[] = [];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Kategori', field: 'categoryName' },
    { label: 'Tedarikçi', field: 'supplierCompanyName' },
    { label: 'Alış Fiyatı', field: 'purchasePrice' },
    { label: 'Satış Fiyatı', field: 'unitPrice' },
    { label: 'Kritik Stok', field: 'criticalCount' },
    { label: 'Stok Adedi', field: 'quantity' },
  ];

  
  deleteDialogDescription = 'Ürün kaydını silmek istediğinizden emin misiniz?';
  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private dialog: MatDialog,
  ){}

  public export(): void {
    var fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    };
    
    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');
    
    var docDefinition = {
      content: [
        { text: 'Merhaba Dünya!', fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        { text: 'Türkçe karakterler: ÇçĞğİıÖöŞşÜü', fontSize: 14 },
      ],
    };
    
    var options = {
      // ...
    }
    
    var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();
  }

  downloadProductsAsPDF() {
    const doc = new jsPDF(); // jsPDF'nin default exportunu kullan

    const tableData = this.tableData.map(product => [product.productName, product.categoryName, product.supplierCompanyName, product.purchasePrice, product.unitPrice, product.criticalCount, product.quantity]);

    doc.setFont('OpenSans-Italic', 'normal');


    (doc as any).autoTable({
      head: [['Ürün Adi', 'Kategori', 'Tedarikçi', 'Alış Fiyati', 'Satis Fiyati', 'Kritik Stok', 'Stok Adedi']],
      body: tableData, 
    });

    doc.save('products.pdf');
  }

  setSelectedProduct(productId: string) {
    this.id = productId;
  }

  ngOnInit(): void{
    this.loadProducts();
  }
 
  loadProducts() {
    this.productService.getProductsByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadProducts();
  }

  getProduct(){
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCreateProductDialog() {
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });    
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const productNameValue = dialog.componentInstance.createForm.value.values[0];
          const categoryIdValue = dialog.componentInstance.createForm.value.values[1];
          const supplierIdValue = dialog.componentInstance.createForm.value.values[2];
          const criticalCountValue = dialog.componentInstance.createForm.value.values[3];
          const purchasePriceValue = dialog.componentInstance.createForm.value.values[4];
          const unitPriceValue = dialog.componentInstance.createForm.value.values[5];
          this.createProduct(productNameValue, categoryIdValue, supplierIdValue, criticalCountValue, purchasePriceValue, unitPriceValue);
        }
      }
    });
    dialog.componentInstance.title = 'Yeni Ürün Oluştur';
    dialog.componentInstance.inputLabels = ['Ürün Adı', 'Kategori', 'Tedarikçi', 'Kritik Stok', 'Alış Fiyatı', 'Satış Fiyatı'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
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
    dialog.componentInstance.title='Ürün Güncelle';
    dialog.componentInstance.inputLabels=['Ürün Adı', 'Kritik Stok', 'Alış Fiyatı', 'Satış Fiyatı'];
    dialog.componentInstance.values.push(new FormControl(item.productName));
    dialog.componentInstance.values.push(new FormControl(item.criticalCount));
    dialog.componentInstance.values.push(new FormControl(item.purchasePrice));
    dialog.componentInstance.values.push(new FormControl(item.unitPrice));
  }

  updateProduct(id: string, /*categoryId: string, supplierId: string,*/ productName: string, criticalCount: number, purchasePrice: number, unitPrice: number ){
    const product = new UpdateProductRequest(id,/* categoryId, supplierId,*/ productName, criticalCount, purchasePrice, unitPrice);
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
} 
