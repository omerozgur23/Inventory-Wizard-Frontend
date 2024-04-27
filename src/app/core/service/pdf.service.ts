import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ShelfService } from '../../modules/warehouse/service/shelf.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  generatePdf(tableData: any[], columns: any[], fileName: string, tableTitle: string) {
    const tableBody = [];
    let title = tableTitle;

    // Tablo başlıkları
    const tableHeaders = columns.map(column => {
      return { text: column.label, style: 'tableHeader' };
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
}
