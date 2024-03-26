import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomerCreateComponent } from './customer-create/customer-create.component';


@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerCreateComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
