import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductSaleComponent } from './product-sale/product-sale.component';



@NgModule({
  declarations: [
    ProductCreateComponent,
    ProductListComponent,
    ProductUpdateComponent,
    ProductSaleComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class ProductModule { }
