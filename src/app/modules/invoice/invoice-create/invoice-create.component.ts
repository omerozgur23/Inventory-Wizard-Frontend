import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProductService } from '../../product/service/product.service';
import { CustomerService } from '../../customer/service/customer.service';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../order/service/order.service';
import { ActivatedRoute } from '@angular/router';

class Product{
  name?: string;
  price = 0;
  qty = 0;
}
class Invoice{
  customerName?: string;
  address?: string;
  contactNo?: number;
  email?: string;
  
  products: Product[] = [];
  additionalDetails?: string;

  constructor(){
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent implements OnInit{

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private route: ActivatedRoute
  ){ (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  productList: any = [];
  customerList: any = [];
  invoice = new Invoice();

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (result) => {
        const orderId = result['id'];
        if (orderId) {
          this.getOrderDetails(orderId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.customerService.getAllCustomer().subscribe({
      next: (result) => {
        this.customerList = result.data
      }
    })
  }

  itemPerPage = 15;
  currentPage = 1;
  getOrderDetails(orderId: string) {
    this.orderService.getOrderDetails(orderId, this.currentPage, this.itemPerPage).subscribe({
      next: (result) => {
        this.productList = result.data;
        console.log(this.productList);
        
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'INVENTORY WIZARD LTD ŞTİ',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price * p.qty).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition as any).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition as any).print();      
    }else{
      pdfMake.createPdf(docDefinition as any).open();      
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }
}
