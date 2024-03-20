import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { ShelfCreateComponent } from './shelf-create/shelf-create.component';
import { ShelfListComponent } from './shelf-list/shelf-list.component';


@NgModule({
  declarations: [
    ShelfCreateComponent,
    ShelfListComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule
  ]
})
export class WarehouseModule { }
