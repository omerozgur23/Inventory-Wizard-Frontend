import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShelfService } from '../service/shelf.service';
import { Shelf } from '../dto/shelf';
import { TableColumn } from '../../../shared/components/table/dto/table';
// import { YesNoDialogComponent } from '../../../shared/yes-no-dialog/yes-no-dialog/yes-no-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrl: './shelf-list.component.scss'
})
export class ShelfListComponent {
  shelfList: Shelf[] = [];
  // tableData: any[] = [];
  // columns: TableColumn[] = [
  //   { label: 'Ürün Adı', field: 'productName' },
  //   { label: 'Ürün Adedi', field: 'count' },
  //   { label: 'Kapasite', field: 'capacity' },
  // ];

  constructor(
    private toastr: ToastrService,
    private shelfService: ShelfService,
    private router: Router,
    private route: ActivatedRoute,
    // private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.getShelfs();
  }

  // getShelfs() {
  //   this.shelfService.getShelf().subscribe((shelves: any[]) => {
  //     this.tableData = shelves;
  //   });
  // }

  navigateCreate(){
    this.router.navigate(['./shelf-create'], { relativeTo: this.route });
  }

  navigateAcceptProduct(){
    this.router.navigate(['./accept-product'], {relativeTo: this.route});
  }

  getShelfs(){
    this.shelfService.getShelf().subscribe({
      next: (result) => {
        this.shelfList = result;
      },
      error: (err) => {
        console.log(err);
        
      }
    });
  }
  // ngOnInit(): void {
  //   this.getShelfs();
  // }

  deleteShelf(id: any){
    this.shelfService.deleteShelf(id).subscribe(
      {
        next: (id) =>{
          this.toastr.success("Raf silinmiştir")
          this.ngOnInit();
        },
        error: (id) => {
          this.toastr.error("Hata oluştu")
        }
      }
    );
  }

  // deleteShelfButtonClicked(id: any) {
  //   let dialog =  this.dialog.open(YesNoDialogComponent, {
  //     width: '300px',
  //     enterAnimationDuration: '250ms',
  //     exitAnimationDuration: '250ms',
  //   });
  //   dialog.afterClosed().subscribe({
  //     next: (data) => {
  //       if (data?.result === 'yes') {
  //         this.deleteShelf(id);
  //       }
  //     }
  //   });
  //   dialog.componentInstance.question = 'Are you sure for delete this shelf?';
  // }
}