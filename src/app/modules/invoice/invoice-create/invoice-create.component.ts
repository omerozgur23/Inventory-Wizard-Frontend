import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { OrderService } from '../../order/service/order.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CreateInvoiceRequest } from '../dto/createInvoiceRequest';
import { InvoiceService } from '../service/invoice.service';
import { GenericService } from '../../../core/service/generic.service';
import { GetOrderByIdRequest } from '../../order/dto/getOrderByIdRequest';


@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent implements OnInit{

  productList: any[] = [];
  selectedCustomer: any;
  createInvoiceForm!: FormGroup;
  orderId: any;
  
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void{
    this.route.queryParams.subscribe({
      next: (result) => {
        this.orderId = result['id'];
        if (this.orderId) {
          this.getOrderDetails(this.orderId);
          this.getCustomerFromOrder(this.orderId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.createInvoiceForm = this.fb.group({
      orderId: '',
      productItems: this.fb.array([this.createProductGroup()]),
    });
  }

  get productItems(): FormArray {
    return this.createInvoiceForm.get('productItems') as FormArray;
  }

  createProductGroup(): FormGroup {
    return this.fb.group({
      productId: '',
      count: 0
    });
  }
  
  addProduct(): void {
    this.productItems.push(this.createProductGroup());
  }

  removeProduct(index: number): void {
    this.productItems.removeAt(index);
  }

  submit(): void {
    const successSaleMessage = this.translateService.instant("invoiceCreatedMessage");
    if (this.createInvoiceForm.valid) {
      const orderId = this.orderId;
      const createInvoiceRequest: CreateInvoiceRequest = {
        orderId,
        productItems: this.createInvoiceForm.value.productItems
      };
      this.invoiceService.createInvoice(createInvoiceRequest).subscribe({
        next: (result) => {
          this.toastr.success(successSaleMessage);
          this.generatePDF('download');
          this.resetProductList();
        },
        error: (err) => {
          console.error(err);
          this.genericService.showError("errorMessage");
        }
      });
    } else {
      this.genericService.showError("productSaleFormValid");
    }
  }

  resetProductList(): void {
    while (this.productItems.length > 1) {
      this.productItems.removeAt(1);
    }
    this.createInvoiceForm.reset({
      orderId: '',
      productItems: [this.createProductGroup()]
    });
  }

  itemPerPage = 15;
  currentPage = 1;
  getOrderDetails(orderId: string) {
    this.orderService.getOrderDetails(orderId, this.currentPage, this.itemPerPage).subscribe({
      next: (result) => {
        this.productList = result.data;        
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }

  getCustomerFromOrder(orderId: string) {
    const request = new GetOrderByIdRequest(orderId);
    this.orderService.getById(request).subscribe({
      next: (result) => {
        this.selectedCustomer = result
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  generatePDF(action = 'open') {
    const productRows = this.productItems.controls.map(control => {
      const product = control.value;
      const productDetail = this.productList.find(p => p.productId === product.productId);
      const productName = productDetail?.productName || '';
      const unitPrice = productDetail?.unitPrice || 0;
      const totalPrice = unitPrice * product.count;
      return [productName, product.count, unitPrice, totalPrice];
    });

    const totalAmount = productRows.reduce((sum, row) => sum + row[3], 0);

    const docDefinition = {
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
                text: this.selectedCustomer.companyName,
                bold: true
              },
              { text: this.selectedCustomer.address },
              { text: this.selectedCustomer.contactEmail },
              { text: this.selectedCustomer.contactPhone }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
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
              ['Product Name', 'Count', 'Unit Price', 'Total Price'],
              ...productRows,
              [{ text: 'Total Amount', colSpan: 3, alignment: 'right' }, {}, {}, totalAmount]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [{ qr: `${this.selectedCustomer.companyName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ul: [
            'Order can be returned within max 10 days.',
            'Warranty of the product will be subject to the manufacturer terms and conditions.',
            'This is a system generated invoice.',
          ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition as any).download();
    } else {
      pdfMake.createPdf(docDefinition as any).open();
    }
  }
}
