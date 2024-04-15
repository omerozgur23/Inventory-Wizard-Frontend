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
    { label: 'Sipariş No', field: 'orderId' },
    { label: 'Ürün Adı', field: 'productName' },
    { label: 'Adet', field: 'quantity' },
    { label: 'Birim Fiyatı', field: 'unitPrice' },
    { label: 'Toplam Fiyat', field: 'totalPrice' },
  ];

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

  getOrderDetails(orderId: string) {
    console.log('Get Order Details Request for Order ID:', orderId);
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (result) => {
        console.log('Order Details:', result); 
        this.tableData = result;
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }
  

}
