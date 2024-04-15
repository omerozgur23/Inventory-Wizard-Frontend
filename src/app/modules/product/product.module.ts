import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductSaleComponent } from './product-sale/product-sale.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductSaleComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatDialogModule,
  ]
})
export class ProductModule { }
