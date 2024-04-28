import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '../../../core/service/pdf.service';

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
  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private pdfService: PdfService,
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrdersByPage(this.currentPage, 18).subscribe({
      next: (result) => {
        this.tableData = this.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  uuidSplit(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.id.split('-')[0];
      return { ...item, shortId };
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadOrder();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (result) => {
        this.tableData = result
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateOrder(){
    this.toastr.info('Siparişler güncellenemez!')
  }

  deleteOrder(){
    this.toastr.info('Siparişler silinemez!');
  }

  navigateOrderDetails(orderId: string) {
    this.router.navigate(['/home/order-details'], { queryParams: { id: orderId } });
  }

  navigateProductSale() {
    this.router.navigate(['/home/product-sale']);
  }

  generatePDF() {
    const fileName = 'orders.pdf';
    const tableTitle = 'Sipariş Listesi';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
  
  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.orderService.search(searchKeyword).subscribe({
          next: (result) => {
            this.tableData = this.uuidSplit(result);
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
