import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { SharedModule } from '../../shared/shared.module';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';


@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDetailComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
  ]
})
export class InvoiceModule { }
