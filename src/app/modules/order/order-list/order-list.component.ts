import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { OrderService } from '../service/order.service';
import { ToastrService } from 'ngx-toastr';
import { GetOrderResponse } from '../dto/getOrderResponse';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'Müşteri Ünvanı', field: 'customerCompanyName' },
    { label: 'Sipariş Oluşturan', field: 'employeeFirstName' },
    { label: 'Sipariş Tarihi', field: 'orderDate' },
  ];

  currentPage: number = 1;
  // totalPages: number = 10;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getAllOrdersByPage(this.currentPage, 2).subscribe(response => {
      this.tableData = response;
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadOrder();
  }

  getOrders() {
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
    // if (orderId && orderId.trim() !== '') { orderId'nin boş olmadığın ve boşluk karekterleri içermediği kontrolü
    //   console.log('Navigating to Order Details for Order ID:', orderId);
    //   this.router.navigate(['/menu/order-details'], { queryParams: { id: orderId } });
    // } else {
    //   console.error('Invalid Order ID:', orderId);
    // }
    this.router.navigate(['/menu/order-details'], { queryParams: { id: orderId } });
  }
  

}
