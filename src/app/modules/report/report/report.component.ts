import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../../core/service/generic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit{

  // Total Sales
  totalSales = 0;

  // Total Sales Product Cost
  totalSalesCost = 0;

  winning = 0;

  // Recent Five Orders
  tableLastFiveOrders: any[] = [];
  lastOrdersColumns: TableColumn[] = [
    { label: 'orderTableOrderCode', field: 'shortId' },
    { label: 'customerTableCompanyName', field: 'customerCompanyName' },
    { label: 'orderTableDate', field: 'orderDate' },
    { label: 'orderTableTotalPrice', field: 'orderPrice' },
  ];

  // Five Customers Who Order The Most
  tableOrdersTheMost: any[] = [];
  ordersTheMostColumns: TableColumn[] = [
    { label: 'customerTableCompanyName', field: 'companyName' },
    { label: 'orderPeace', field: 'count' },
  ]

  // 5 Employee To Send The Most Orders
  tableMostOrderSenders: any[] = [];
  mostOrderSendersColumns: TableColumn[] = [
    { label: 'employeeTableFirstName', field: 'firstName' },
    { label: 'employeeTableLastName', field: 'lastName'},
    { label: 'orderPeace', field: 'count' },
  ]

  // Best Selling Products
  tableBestSellingProducts: any[] = [];
  bestSellingProductsColumns: TableColumn[] = [
    { label: 'productTableProductCode', field: 'shortId' },
    { label: 'productTableProductName', field: 'productName' },
    { label: 'productTablePurchasePrice', field: 'purchasePrice' },
    { label: 'productTableUnitPrice', field: 'unitPrice' },
    { label: 'productTableQuantity', field: 'quantity' },
    { label: 'orderPeace', field: 'count' },
  ]

  constructor(
    private reportService: ReportService,
    public translateService: TranslateService,
    private genericService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  navigateRecentOrders(){
    this.router.navigate(['/home/report/recent-orders']);
  }
  
  ngOnInit(): void {
    this.getTotalSales();
    this.getLastFiveOrders();
    this.getOrdersTheMost();
    this.getMostOrderSenders();
    this.getBestSellingProducts();
    this.getTotalSalesCost();
    this.getWinning();
  }

  getTotalSales(){
    this.reportService.getTotalSales().subscribe({
      next: (result) => {
        this.totalSales = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getTotalSalesCost(){
    this.reportService.getTotalSalesCost().subscribe({
      next: (result) => {
        this.totalSalesCost = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getWinning(){
    this.reportService.getWinning().subscribe({
      next: (result) => {
        this.winning = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getLastFiveOrders(){
    this.reportService.getLastFiveOrders().subscribe({
      next: (result) => {
        this.tableLastFiveOrders = this.genericService.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getOrdersTheMost(){
    this.reportService.getOrdersTheMost().subscribe({
      next: (result) => {
        this.tableOrdersTheMost = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getMostOrderSenders(){
    this.reportService.getMostOrderSenders().subscribe({
      next: (result) => {
        this.tableMostOrderSenders = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getBestSellingProducts(){
    this.reportService.getBestSellingProducts().subscribe({
      next: (result) => {
        this.tableBestSellingProducts = this.genericService.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
