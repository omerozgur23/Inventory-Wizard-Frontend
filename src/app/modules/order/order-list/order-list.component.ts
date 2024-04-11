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
    { label: 'Müşteri Ünvanı', field: 'customerCompanyName' },
    { label: 'Sipariş Oluşturan', field: 'employeeFirstName' },
    { label: 'Sipariş Tarihi', field: 'orderDate' },
  ];

  currentPage: number = 1;
  totalPages: number = 10;

  constructor(
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((orders: any[]) => {
      this.tableData = orders;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getAllOrdersByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }
  
}
