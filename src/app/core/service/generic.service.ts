import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(
    private translateService: TranslateService,
    private toastr: ToastrService
  ) { (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  uuidSplit(data: any[]): any[] {
    return data.map(item => {
      const shortId = '#' + item.id.split('-')[0];
      return { ...item, shortId };
    });
  }

  generatePdf(tableData: any[], columns: any[], fileName: string, tableTitle: string) {
    const tableBody = [];
    let title = tableTitle;

    // Tablo başlıkları
    let tableHeaders = columns.map(column => {
      const translatedColumnLabel = this.translateService.instant(column.label);
      return { text: translatedColumnLabel, style: 'tableHeader' };
    });
    
    tableBody.push(tableHeaders);

    // Tablo satırları
    tableData.forEach(item => {
      const rowData = columns.map(column => item[column.field]);
      tableBody.push(rowData);
    });

    const docDefinition = {
      content: [
        { text: title , style: 'header' },
        { table: { body: tableBody } }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          fillColor: '#333333', // Arka plan rengi
          color: '#FFF', // Metin rengi (siyah)
          bold: true,
        }
      }
    };

    pdfMake.createPdf(docDefinition as any).download(fileName);
  }

  showError(messageKey: string) {
    const errorMessage = this.translateService.instant(messageKey);
    this.toastr.error(errorMessage);
  }

  showCreateInvoiceInfo(messageKey: string) {
    const errorMessage = this.translateService.instant(messageKey);
    this.toastr.info(errorMessage);
  }

  showAuthError(messageKey: string) {
    const errorMessage = this.translateService.instant(messageKey);
    this.toastr.error(errorMessage);
  }
}
