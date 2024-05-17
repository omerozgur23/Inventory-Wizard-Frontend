import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit{

  totalSales = 0;
  totalSalesCost = 0;
  winning = 0;

  constructor(
    private reportService: ReportService,
    public translateService: TranslateService,
    private router: Router,
  ){}
  
  ngOnInit(): void {
    this.getTotalSales();
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

  navigateRecentOrders(){
    this.router.navigate(['/home/report/recent-orders']);
  }

  navigateTopOrderers(){
    this.router.navigate(['/home/report/top-orderers']);
  }

  navigateMostOrderSenders(){
    this.router.navigate(['/home/report/most-order-senders']);
  }

  navigateBestSellingProducts(){
    this.router.navigate(['/home/report/best-selling-products']);
  }
}
