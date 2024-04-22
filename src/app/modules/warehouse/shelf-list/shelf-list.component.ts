import { UpdateModalComponent } from './../../../shared/components/update-modal/update-modal.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateModalComponent } from '../../../shared/components/create-modal/create-modal.component';
import { CreateShelfRequest } from '../dto/createShelfRequest';
import { UpdateShelfRequest } from '../dto/updateShelfRequest';
import { GetProductResponse } from '../../product/dto/getProductResponse';
import { ProductService } from '../../product/service/product.service';
import { forkJoin, count } from 'rxjs';
import { AcceptProductModalComponent } from '../../../shared/components/accept-product-modal/accept-product-modal.component';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss'
})
export class ShelfListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Ürün Adedi', field: 'count' },
    { label: 'Kapasite', field: 'capacity' },
  ];

  productList: GetProductResponse[] = [];
  acceptProductForm = this.fb.group({
    productId: '',
    count: 0,
  });
  // shelfForm = this.fb.group({
  //   count: [null, Validators.required],
  //   capacity: [null, Validators.required]
  // });

  deleteDialogDescription = 'Raf kaydını silmek istediğinizden emin misiniz?';
  id = '';
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private productService: ProductService,
  ){}

  setSelectedShelf(shelfId: string) {
    this.id = shelfId;
  }

  ngOnInit(): void { 
    this.loadShelves();

    forkJoin({
      products: this.productService.getAllProducts(),
    }).subscribe({
      next: (resp => {
        this.productList = resp.products;
      }),
      error: (err => {
        console.log(err);
      })
    })
  }

  // acceptProduct() {
  //   this.shelfService.acceptProduct(this.acceptProductForm.value ).subscribe({
  //     next: (resp) => {
  //       this.toastr.success('Ürün Girişi Yapıldı');
  //       this.loadShelve();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.toastr.error("Hata oluştu");
  //     }
  //   });
  // }

  loadShelves() {
    this.shelfService.getShelvesByPage(this.currentPage, 15).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadShelves();
  }

  getAllShelfs(){
    this.shelfService.getAllShelf().subscribe({
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
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          const capacityValue = dialog.componentInstance.createForm.value.values[0];
          const countValue = dialog.componentInstance.createForm.value.values[1];
          this.createShelf(capacityValue, countValue);
        }
      }
    });
    dialog.componentInstance.title = 'Yeni Raf Oluştur';
    dialog.componentInstance.inputLabels = ['Kapasite', 'Adet'];
    dialog.componentInstance.values.push(new FormControl(''));
    dialog.componentInstance.values.push(new FormControl(''));
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
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data?.result === 'yes') {
          // this.updateShelf(item.id,parseInt(dialog.componentInstance.updateForm.value.capacity!));

        // const capacityValue = parseInt(dialog.componentInstance.updateForm.value.values[0],10);
        const capacityValue = dialog.componentInstance.updateForm.value.values[0];
        this.updateShelf(item.id, capacityValue);
        }
      }
    });
    // dialog.componentInstance.updateForm.patchValue({capacity:item.capacity});
    dialog.componentInstance.title='Raf Güncelle';
    dialog.componentInstance.inputLabels=['Kapasite'];
    dialog.componentInstance.values.push(new FormControl(item.capacity));
  }

  updateShelf(id: string, capacity: number){
    const shelf = new UpdateShelfRequest(id, capacity)
    this.shelfService.updateShelf(shelf).subscribe({
      next: (resp) => {
        this.toastr.success('Raf Bilgileri Güncellendi');
        this.loadShelves();
      },
      error: (err) => {
        if (capacity > 5) {
          this.toastr.error('Raf kapasitesi maksimum 5 olabilir!')
        }
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
 
  // submit(){
  //   this.shelfService.createShelf(this.shelfForm.value).subscribe({
  //     next: (resp) => {
  //       this.toastr.success('Shelf Oluşturulmuştur');
  //       this.ngOnInit();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.toastr.error("Hata oluştu");
  //     }
  //   })
  // }

  openAcceptProductDialog(item: any) {
    const dialogRef = this.dialog.open(AcceptProductModalComponent, {
      width: '500px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '250ms',
      data : {
        title: 'Ürün Girişi',
        productList: this.productList,
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.result === 'yes') {
        const formValue = result.formValue;
        // const countValue = formValue.count;
        this.acceptProduct(formValue);
      }
    });
  }
  

  acceptProduct(formValue: any) {
    this.shelfService.acceptProduct(formValue).subscribe({
      next: (resp) => {
        this.toastr.success('Ürün Girişi Yapıldı');
        this.loadShelves();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    });
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}