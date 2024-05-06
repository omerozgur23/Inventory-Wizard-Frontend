import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SupplierListComponent,
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
  ]
})
export class SupplierModule { }
