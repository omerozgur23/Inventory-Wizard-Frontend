import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from '../../../core/service/generic.service';

@Component({
  selector: 'app-top-orderers',
  templateUrl: './top-orderers.component.html',
  styleUrl: './top-orderers.component.scss'
})
export class TopOrderersComponent implements OnInit{

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService,
    private genericService: GenericService,
  ){}

  tableTitle = 'reportTopOrderers';
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'customerTableCompanyName', field: 'companyName' },
    { label: 'orderPeace', field: 'count' },
  ]

  ngOnInit(): void {
    this.getOrdersTheMost();
  }

  getOrdersTheMost(){
    this.reportService.getOrdersTheMost().subscribe({
      next: (result) => {
        this.tableData = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  generatePDF() {
    const fileName = 'top-orderers.pdf';
    const tableTitle = this.translateService.instant("topOrderersPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
}
