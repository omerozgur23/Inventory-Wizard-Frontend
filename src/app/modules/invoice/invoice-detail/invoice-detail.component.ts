import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { InvoiceService } from '../service/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../core/service/generic.service';

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
  itemPerPage = 15;
  totalInvoiceDetailsCount = 0;
  totalPages = 0;

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
          this.loadInvoiceDetail(invoiceId);
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

  loadInvoiceDetail(invoiceId: string) {
    this.invoiceService.getInvoiceDetail(invoiceId, this.currentPage, this.itemPerPage).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
        this.totalInvoiceDetailsCount = result.count;
        this.totalPages = Math.ceil(this.totalInvoiceDetailsCount / this.itemPerPage) 
      },
      error: (err) => {
        console.error('Error fetching invoice details:', err);
      }
    });
  }
}
