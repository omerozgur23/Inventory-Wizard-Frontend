import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../service/invoice.service';
import { GenericService } from '../../../core/service/generic.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit{
  tableTitle = 'invoiceTableTitle';
  tableData: any[] = [];
  columns: TableColumn[] = [
    { label: 'invoiceTableInvoiceCode', field: 'shortId' },
    { label: 'invoiceTableCompanyName', field: 'companyName' },
    { label: 'invoiceTableTotalAmount', field: 'totalAmount' },
    { label: 'invoiceTableWaybillDate', field: 'waybillDate' },
  ];

  id = '';
  itemPerPage = 15;
  currentPage = 1;
  totalInvoicesCount = 0;
  totalPages = 0;
  
  constructor(
    private invoiceService: InvoiceService,
    private genericService: GenericService,
    private router: Router,
  ){}
  
  ngOnInit(): void {
    this.loadInvoice();
  }

  setSelectedShelf(invoiceId: string) {
    this.id = invoiceId;
  }

  loadInvoice() {
    this.invoiceService.getInvoicesByPage(this.currentPage, this.itemPerPage).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
        this.totalInvoicesCount = result.count;
        this.totalPages = Math.ceil(this.totalInvoicesCount / this.itemPerPage) 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    this.loadInvoice();
  }

  onSearchInputChange(searchKeyword: string) {
    if (searchKeyword.trim() !== '' && searchKeyword !== undefined && searchKeyword !== null) {
      setTimeout(() => 
        this.invoiceService.search(searchKeyword).subscribe({
          next: (result) => {
            this.tableData = this.genericService.uuidSplit(result);
          },
          error: (err) => {
            console.log(err);
          }
        }),
        300
      );
    } else {
      this.loadInvoice();
    }
  }

  navigateInvoiceDetails(invoiceId: string) {
    this.router.navigate(['/home/invoice-details'], { queryParams: { id: invoiceId } });
  } 

  openUpdateInvoiceDialog(item: any){};

  setSelectedInvoice(id: any){};
}
