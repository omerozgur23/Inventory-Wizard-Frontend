import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { InvoiceService } from '../service/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../core/service/generic.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit{

  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'invoiceDetailsTableProductName', field: 'productName' },
    { label: 'invoiceDetailsTableQuantity', field: 'quantity' },
    { label: 'invoiceDetailsTableUnitPrice', field: 'unitPrice' },
    { label: 'invoiceDetailsTableTotalPrice', field: 'totalPrice' },
  ];

  tableTitle = "invoiceDetailsTableTitle";
  currentPage: number = 1;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private genericService: GenericService,
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (result) => {
        const invoiceId = result['id'];
        if (invoiceId) {
          this.getInvoiceDetail(invoiceId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.ngOnInit();
  }

  getInvoiceDetail(invoiceId: string) {
    this.invoiceService.getInvoiceDetail(invoiceId).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
      },
      error: (err) => {
        console.error('Error fetching invoice details:', err);
      }
    });
  }

}
