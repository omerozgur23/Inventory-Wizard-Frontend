import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceService } from '../../invoice/service/invoice.service';
import { AuthService } from '../../../core/service/auth.service';

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
    { label: 'orderTableStatus', field: 'orderStatus' },
    { label: 'orderTableInvoiceGenerated', field: 'invoiceGenerated' },
  ];
  tableTitle = "orderTableTitle";
  itemPerPage = 15;
  currentPage = 1;
  totalShelvesCount = 0;
  totalPages = 0;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private genericService: GenericService,
    private translateService: TranslateService,
    private invoiceService: InvoiceService,
    private authService: AuthService,
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
  
  id = '';
  setSelectedOrder(orderId: string) {
    this.id = orderId;
  }

  createInvoice(id: any){
    if (this.authService.isAdmin() || this.authService.isWarehouseSupervisor()) {
      const successCreatedMessage = this.translateService.instant('invoiceCreatedMessage');
      this.invoiceService.createInvoice(id).subscribe(
        {
          next: (result) =>{
            this.toastr.success(successCreatedMessage)
            this.loadOrder();
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

}
