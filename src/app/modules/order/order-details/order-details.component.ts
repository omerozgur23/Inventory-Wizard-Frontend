import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Sipariş No', field: 'shortId' },
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Adet', field: 'quantity' },
    { label: 'Birim Fiyatı', field: 'unitPrice' },
    { label: 'Toplam Fiyat', field: 'totalPrice' },
  ];

  currentPage: number = 1;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        console.log('Received Order ID:', orderId);
        this.getOrderDetails(orderId);
      }
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.ngOnInit();
    // this.getOrderDetails(this.tableData[0].orderId);
  }

  getOrderDetails(orderId: string) {
    console.log('Get Order Details Request for Order ID:', orderId);
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (result) => {
        console.log('Order Details:', result); 
        this.tableData = this.processData(result);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  processData(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.orderId.split('-')[0];
      return { ...item, shortId };
    });
  }
  

}
