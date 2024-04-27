import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { AcceptProductModalComponent } from './components/accept-product-modal/accept-product-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TableComponent,
    DeleteModalComponent,
    UpdateModalComponent,
    CreateModalComponent,
    AcceptProductModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    TableComponent,
    DeleteModalComponent,
    UpdateModalComponent,
  ]
})
export class SharedModule { }
