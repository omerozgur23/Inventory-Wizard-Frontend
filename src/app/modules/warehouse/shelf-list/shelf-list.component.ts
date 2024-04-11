import { UpdateModalComponent } from './../../../shared/components/update-modal/update-modal.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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

  shelfForm = this.fb.group({
    count: [null, Validators.required],
    capacity: [null, Validators.required]
  });


  id = '';

  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ){}

  setSelectedShelf(shelfId: string) {
    this.id = shelfId;
  }

  ngOnInit(): void { 
    this.loadShelve();
    
  }

  loadShelve() {
    this.shelfService.getShelvesByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadShelve();
  }

  // getShelfs(){
  //   this.shelfService.getShelf().subscribe({
  //     next: (result) => {
  //       this.tableData = result;
  //     },
  //     error: (err) => {
  //       console.log(err);
        
  //     }
  //   });
  // }

  // navigateCreate(){
  //   this.router.navigate(['./create'], { relativeTo: this.route });
  // }

  navigateAcceptProduct(){
    this.router.navigate(['./accept-product'], {relativeTo: this.route});
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

  updateShelf(id: string, capacity: number){  
    this.shelfService.updateShelf(id, capacity).subscribe({
      next: (resp) => {
        this.toastr.success('Raf Güncellenmiştir');
        this.loadShelve();
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
          // this.updateShelf(item.id,parseInt(dialog.componentInstance.updateForm.value.capacity!));

          // this.updateShelf(item.id,parseInt(dialog.componentInstance.updateForm.value.values['capacity'])); 

        const capacityValue = parseInt(dialog.componentInstance.updateForm.value.values[0],10);
        this.updateShelf(item.id, capacityValue);
        }
      }
    });
    // dialog.componentInstance.updateForm.patchValue({capacity:item.capacity});
    dialog.componentInstance.title='Raf Güncelle';
    dialog.componentInstance.inputLabels=['Kapasite'];
    dialog.componentInstance.values.push(new FormControl(item.capacity));
    // dialog.componentInstance.degerler.push(new FormControl(item.count));
    // dialog.componentInstance.degerler.push(new FormControl(item.productName));
  }
  
 
  submit(){
    this.shelfService.createShelf(this.shelfForm.value).subscribe({
      next: (resp) => {
        this.toastr.success('Shelf Oluşturulmuştur');
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error("Hata oluştu");
      }
    })
  }
}