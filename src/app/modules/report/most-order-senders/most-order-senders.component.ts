import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../../../shared/components/table/dto/table';

@Component({
  selector: 'app-most-order-senders',
  templateUrl: './most-order-senders.component.html',
  styleUrl: './most-order-senders.component.scss'
})
export class MostOrderSendersComponent implements OnInit{

  constructor(
    private reportService: ReportService,
    private genericService: GenericService,
    private translateService: TranslateService,
  ){}

  tableTitle = 'mostOrderSenders';
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'employeeTableFirstName', field: 'firstName' },
    { label: 'employeeTableLastName', field: 'lastName'},
    { label: 'orderPeace', field: 'count' },
  ]

  ngOnInit(): void {
    this.getMostOrderSenders();
  }

  getMostOrderSenders(){
    this.reportService.getMostOrderSenders().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  generatePDF(){
    const fileName = 'most-order-senders.pdf';
    const tableTitle = this.translateService.instant("mostOrderSendersPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }

}
