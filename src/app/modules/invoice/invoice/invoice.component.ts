import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../service/invoice.service';
import { GenericService } from '../../../core/service/generic.service';
import { TableColumn } from '../../../shared/components/table/dto/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/service/auth.service';
import { SearchInvoiceRequest } from '../dto/searchInvoiceRequest';
import { PaginationRequest } from '../../category/dto/paginationRequest';
import { CancellationInvoiceRequest } from '../dto/cancellationInvoiceRequest';

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
    { label: 'invoiceTableOrderCode', field: 'orderId' },
    { label: 'invoiceTableCompanyName', field: 'companyName' },
    { label: 'invoiceTableTotalAmount', field: 'totalAmount' },
    { label: 'invoiceTableWaybillDate', field: 'waybillDate' },
    { label: 'invoiceTableStatus', field: 'status' },
  ];

  invoiceCancellationDescription = "invoiceCancellationDialogDescription";
  id = '';
  itemPerPage = 15;
  currentPage = 1;
  totalInvoicesCount = 0;
  totalPages = 0;
  isStatusTrue?: string;
  isStatusFalse?: string;
  
  constructor(
    private invoiceService: InvoiceService,
    private genericService: GenericService,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private authService: AuthService,
  ){
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit()
    });
  }
  
  ngOnInit(): void {
    this.loadInvoice();
    this.updateStatusTranslations();
  }

  private updateStatusTranslations(): void {
    this.isStatusTrue = this.translateService.instant('invoiceTableStatusTrue');
    this.isStatusFalse = this.translateService.instant('invoiceTableStatusFalse');
  }

  setSelectedShelf(invoiceId: string) {
    this.id = invoiceId;
  }

  loadInvoice() {
    this.invoiceService.getInvoicesByPage(new PaginationRequest(this.currentPage, this.itemPerPage)).subscribe({
      next: (result) => {
        this.tableData = this.genericService.uuidSplit(result.data);
        this.tableData.forEach(item => {
          item.orderId = '#' + item.orderId.split('-')[0];
        })
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
      const keyword = new SearchInvoiceRequest(searchKeyword);
      setTimeout(() => 
        this.invoiceService.search(keyword).subscribe({
          next: (result) => {
            this.tableData = this.genericService.uuidSplit(result.data);
            this.tableData.forEach(item => {
              item.orderId = '#' + item.orderId.split('-')[0];
            })
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

  openUpdateInvoiceDialog(){
    const invoiceUpdateButtonMessage = this.translateService.instant("invoiceUpdateButtonMessage");
    this.toastr.info(invoiceUpdateButtonMessage)
  };

  setSelectedInvoice(invoiceId: any){
    this.id = invoiceId;
  };

  invoiceCancellation(id: any){
    if (this.authService.isAdmin()) {
      const successCancellationMessage = this.translateService.instant('cancellationInvoiceMessage');
      this.invoiceService.invoiceCancellation(new CancellationInvoiceRequest(id)).subscribe(
        {
          next: (result) =>{
            this.toastr.success(successCancellationMessage)
            this.loadInvoice();
          },
          error: (err) => {
            console.log(err);
            this.genericService.showError("cancellationInvoiceErrorMessage");
          }
        }
      );
    }
    else {
      this.genericService.showAuthError("authorizationError");
    }
  }
}
