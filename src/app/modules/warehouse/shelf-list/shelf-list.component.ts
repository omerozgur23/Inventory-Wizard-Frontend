import { UpdateModalComponent } from './../../../shared/components/update-modal/update-modal.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { GetProductResponse } from '../../product/dto/getProductResponse';
import { ProductService } from '../../product/service/product.service';
import { forkJoin } from 'rxjs';
import { AcceptProductModalComponent } from '../../../shared/components/accept-product-modal/accept-product-modal.component';
import { PdfService } from '../../../core/service/pdf.service';
import { GenericService } from '../../../core/service/generic.service';

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
  productList: GetProductResponse[] = [];
  deleteDialogDescription = 'deleteShelfDialogDescription';
  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;
  acceptProductForm = this.fb.group({
    productId: '',
    count: 0,
  });

  constructor(
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private productService: ProductService,
    private pdfService: PdfService,
    private genericService: GenericService,
    // private cdr: ChangeDetectorRef,
  ){}

  setSelectedShelf(shelfId: string) {
    this.id = shelfId;
  }

  ngOnInit(): void { 
    this.loadShelves();

    forkJoin({
      products: this.productService.getAllProducts(),
    }).subscribe({
      next: (result) => {
        this.productList = result.products;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadShelves() {
    this.shelfService.getShelvesByPage(this.currentPage, 15).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // uuidSplit(data: any[]): any[] {
  //   return data.map(item => {
  //     const shortId = '#' + item.id.split('-')[0];
  //     return { ...item, shortId };
  //   });
  // }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadShelves();
  }

  getAllShelves(){
    this.shelfService.getAllShelves().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  navigateAcceptProduct(){
    this.router.navigate(['./accept-product'], {relativeTo: this.route});
  }

  openCreateShelfDialog(){
    let dialog = this.dialog.open(CreateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title = 'createShelfTitle';
    dialog.componentInstance.inputLabels = ['shelfTableCapacity', 'shelfInputsPeace'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const capacityValue = dialog.componentInstance.createForm.value.values[0];
          const countValue = dialog.componentInstance.createForm.value.values[1];
          this.createShelf(capacityValue, countValue);
        }
      }
    });
  }

  createShelf(capacity: number, count: number){
    const shelf = new CreateShelfRequest(capacity, count);
    this.shelfService.createShelf(shelf).subscribe({
      next: (resp) => {
        this.toastr.success('Yeni raf oluşturuldu');
        this.loadShelves();
      },
      error: (err) => {
        if (capacity > 5) {
          this.toastr.error('Raf kapasitesi maksimum 5 olabilir!');
        }if (count > 2) {
          this.toastr.info('Tek seferde maksimum 10 raf oluşturulabilir!')
        }
        console.log(err);
        // else{
        //   this.toastr.error('Hata oluştu!');
        // }
      }
    });
  }

  openUpdateShelfDialog(item: any){
    let dialog =  this.dialog.open(UpdateModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
    });

    dialog.componentInstance.title='updateShelfTitle';
    dialog.componentInstance.inputLabels=['shelfTableCapacity'];
    dialog.componentInstance.values.push(new FormControl(item.capacity));

    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
        const capacityValue = dialog.componentInstance.updateForm.value.values[0];
        this.updateShelf(item.id, capacityValue);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateShelf(id: string, capacity: number){
    const shelf = new UpdateShelfRequest(id, capacity)
    this.shelfService.updateShelf(shelf).subscribe({
      next: (result) => {
        this.toastr.success('Raf Bilgileri Güncellendi');
        this.loadShelves();
      },
      error: (err) => {
        if (capacity > 5) {
          this.toastr.error('Raf kapasitesi maksimum 5 olabilir!')
        }
        console.log(err);
      }
    })
  }
  
  deleteShelf(id: any){
    this.shelfService.deleteShelf(id).subscribe(
      {
        next: () =>{
          this.toastr.success("Raf silinmiştir")
          this.ngOnInit();
        },
        error: () => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  openAcceptProductDialog(item: any) {
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
  

  acceptProduct(formValue: any) {
    this.shelfService.acceptProduct(formValue).subscribe({
      next: (result) => {
        this.toastr.success('Ürün Girişi Yapıldı');
        this.loadShelves();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }

  generatePDF() {
    const fileName = 'shelves.pdf';
    const tableTitle = 'Raf Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.shelfService.search(searchKeyword).subscribe({
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
      this.loadShelves();
    }
  }
  // onSearchInputChange(searchKeyword: string) {
  //   this.genericService.onSearchInputChange(searchKeyword, this.loadShelves.bind(this));
  //   this.tableData = this.genericService.getSearchResponse();
  // }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}