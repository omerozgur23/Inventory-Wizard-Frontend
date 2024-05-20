import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'orderDetailsTableOrderCode', field: 'shortId' },
    { label: 'orderDetailsTableProductName', field: 'productName' },
    { label: 'orderDetailsTableQuantity', field: 'quantity' },
    { label: 'orderDetailsTableUnitPrice', field: 'unitPrice' },
    { label: 'orderDetailsTableTotalPrice', field: 'totalPrice' },
  ];

  tableTitle = "orderDetailsTableTitle";
  itemPerPage = 15;
  currentPage = 1;
  totalOrderDetailsCount = 0;
  totalPages = 0;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private translateService: TranslateService,
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (result) => {
        const orderId = result['id'];
        if (orderId) {
          this.getOrderDetails(orderId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.ngOnInit();
  }

  getOrderDetails(orderId: string) {
    this.orderService.getOrderDetails(orderId, this.currentPage, this.itemPerPage).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
        this.totalOrderDetailsCount = result.count;
        this.totalPages = Math.ceil(this.totalOrderDetailsCount / this.itemPerPage) 
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  generatePDF(){
    const fileName = 'orderDetails.pdf';
    const tableTitle = this.translateService.instant("orderDetailPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
}
