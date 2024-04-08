import { Component } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Müşteri Ünvanı', field: 'companyName' },
    { label: 'Sipariş Oluşturan', field: 'firstName' },
    { label: 'Sipariş Tarihi', field: 'orderDate' },
  ];

  constructor(
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((orders: any[]) => {
      this.tableData = orders;
    });
  }
}
