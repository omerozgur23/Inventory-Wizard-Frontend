import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { ShelfCreateComponent } from './shelf-create/shelf-create.component';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AcceptProductComponent } from './accept-product/accept-product.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ShelfCreateComponent,
    ShelfListComponent,
    AcceptProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WarehouseRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class WarehouseModule { }
