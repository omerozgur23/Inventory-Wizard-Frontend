import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'orderTableOrderCode', field: 'shortId' },
    { label: 'orderTableCustomer', field: 'customerCompanyName' },
    { label: 'orderTableEmployee', field: 'employeeFirstName' },
    { label: 'orderTableDate', field: 'orderDate' },
    { label: 'orderTableTotalPrice', field: 'orderPrice' },
  ];

  tableTitle = "orderTableTitle";
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;
  // totalPages: number = 10;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrdersByPage(this.currentPage, this.itemPerPage).subscribe({
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
    this.loadOrder();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (result) => {
        this.tableData = result.data
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateOrder(){
    const errorUpdateMessage = this.translateService.instant("orderUpdateButtonMessage");
    this.toastr.info(errorUpdateMessage)
  }

  deleteOrder(){
    const errorDeleteMessage = this.translateService.instant("orderDeleteButtonMessage");
    this.toastr.info(errorDeleteMessage);
  }

  navigateOrderDetails(orderId: string) {
    this.router.navigate(['/home/order-details'], { queryParams: { id: orderId } });
  }

  navigateProductSale() {
    this.router.navigate(['/home/product-sale']);
  }

  generatePDF() {
    const fileName = 'orders.pdf';
    const tableTitle = this.translateService.instant("orderPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.orderService.search(searchKeyword).subscribe({
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
      this.loadOrder();
    }
  }
  
  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
