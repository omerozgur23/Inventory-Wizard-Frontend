import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '../../../core/service/pdf.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Sipariş Kodu', field: 'shortId' },
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Adet', field: 'quantity' },
    { label: 'Birim Fiyatı', field: 'unitPrice' },
    { label: 'Toplam Fiyat', field: 'totalPrice' },
  ];

  tableTitle = "Sipariş Detayları";
  currentPage: number = 1;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private pdfService: PdfService,
    private router: Router,
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
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (result) => {
        this.tableData = this.uuidSplit(result);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  uuidSplit(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.orderId.split('-')[0];
      return { ...item, shortId };
    });
  }

  generatePDF(){
    const fileName = 'orderDetails.pdf';
    const tableTitle = 'Sipariş Detayı';
    this.pdfService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

  navigateSettings(){
    this.router.navigate(['/home/settings']);
  }
}
