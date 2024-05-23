import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { SharedModule } from '../../shared/shared.module';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceCreateComponent } from './invoice-create/invoice-create.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDetailComponent,
    InvoiceCreateComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    FormsModule,
  ],
  exports: [
    InvoiceCreateComponent,
  ]
})
export class InvoiceModule { }
