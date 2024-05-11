import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../../core/service/generic.service';

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss'
})
export class RecentOrdersComponent implements OnInit {

  tableTitle = "reportRecentOrder";
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'orderTableOrderCode', field: 'shortId' },
    { label: 'customerTableCompanyName', field: 'customerCompanyName' },
    { label: 'orderTableDate', field: 'orderDate' },
    { label: 'orderTableTotalPrice', field: 'orderPrice' },
  ]

  constructor(
    private reportService: ReportService,
    private genericService: GenericService,
    private translateService: TranslateService,
  ){}

  ngOnInit(): void {
    this.getRecentOrders();
  }

  getRecentOrders(){
    this.reportService.getLastFiveOrders().subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  generatePDF(){
    const fileName = 'recent-orders.pdf';
    const tableTitle = this.translateService.instant("recentOrdersPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

}
