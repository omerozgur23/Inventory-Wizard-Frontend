import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GenericService } from '../../../core/service/generic.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/service/auth.service';
import { SearchOrderRequest } from '../dto/searchOrderRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';

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
    { label: 'orderTableEmployee', field: 'employeeFullName' },
    { label: 'orderTableDate', field: 'orderDate' },
    { label: 'orderTableTotalPrice', field: 'orderPrice' },
    { label: 'orderTableStatus', field: 'status' },
    { label: 'orderTableInvoiceGenerated', field: 'invoiceGenerated' },
  ];

  tableTitle = "orderTableTitle";
  itemPerPage = 15;
  currentPage = 1;
  totalOrderCount = 0;
  totalPages = 0;
  isStatusTrue?: string;
  isStatusFalse?: string;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private genericService: GenericService,
    private translateService: TranslateService,
    private authService: AuthService,
  ) {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
    this.loadOrder();
    this.updateStatusTranslations();
  }

  private updateStatusTranslations(): void {
    this.isStatusTrue = this.translateService.instant('orderTableStatusTrue');
    this.isStatusFalse = this.translateService.instant('orderTableStatusFalse');
  }

  loadOrder() {
    this.orderService.getOrdersByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
        this.tableData.forEach(item => {
          item.invoiceGenerated = item.invoiceGenerated ? this.isStatusTrue : this.isStatusFalse;
          item.employeeFullName = `${item.employeeFirstName} ${item.employeeLastName}`;
        })
        this.totalOrderCount = result.count;
        this.totalPages = Math.ceil(this.totalOrderCount / this.itemPerPage) 
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
      const keyword = new SearchOrderRequest(searchKeyword);
      setTimeout(() => 
        this.orderService.search(keyword).subscribe({
          next: (result) => {
            this.tableData = this.genericService.uuidSplit(result.data);
            this.tableData.forEach(item => {
              item.invoiceGenerated = item.invoiceGenerated ? this.isStatusTrue : this.isStatusFalse;
              item.employeeFullName = `${item.employeeFirstName} ${item.employeeLastName}`;
            })
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
    const selectedOrder = this.tableData.find(order => order.id === orderId);
  if (selectedOrder.invoiceGenerated == 'Inactive' && selectedOrder.status == 'ACTIVE') {
    this.router.navigate(['/home/order/invoice'], { queryParams: { id: orderId } });
  } else {
    this.genericService.showError("createdInvoiceInfoMessage");
  }
  }
}
