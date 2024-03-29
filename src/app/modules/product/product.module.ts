import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ProductCreateComponent,
    ProductListComponent,
    ProductUpdateComponent
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
