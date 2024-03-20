import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { ShelfCreateComponent } from './shelf-create/shelf-create.component';
import { ShelfListComponent } from './shelf-list/shelf-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShelfCreateComponent,
    ShelfListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WarehouseRoutingModule
  ]
})
export class WarehouseModule { }
