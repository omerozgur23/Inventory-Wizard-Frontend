import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../../../shared/components/table/dto/table';

@Component({
  selector: 'app-best-selling-products',
  templateUrl: './best-selling-products.component.html',
  styleUrl: './best-selling-products.component.scss'
})
export class BestSellingProductsComponent implements OnInit{

  constructor(
    private reportService: ReportService,
    private genericService: GenericService,
    private translateService: TranslateService,
  ){}

  tableTitle = "bestSellingProducts"
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'productTableProductCode', field: 'shortId' },
    { label: 'productTableProductName', field: 'productName' },
    { label: 'productTablePurchasePrice', field: 'purchasePrice' },
    { label: 'productTableUnitPrice', field: 'unitPrice' },
    { label: 'productTableQuantity', field: 'quantity' },
    { label: 'orderPeace', field: 'count' },
  ]

  ngOnInit(): void {
    this.getBestSellingProducts();
  }

  getBestSellingProducts(){
    this.reportService.getBestSellingProducts().subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  generatePDF(){
    const fileName = 'best-selling-products.pdf';
    const tableTitle = this.translateService.instant("bestSellingProductsPdfTitle");
    this.genericService.generatePdf(this.tableData, this.columns, fileName, tableTitle);
  }
}
