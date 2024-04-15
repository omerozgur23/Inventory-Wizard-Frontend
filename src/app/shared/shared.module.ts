import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { CreateComponent } from './components/forms/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    DeleteModalComponent,
    UpdateModalComponent,
    CreateModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    TableComponent,
    CreateComponent,
    DeleteModalComponent,
    UpdateModalComponent,
  ]
})
export class SharedModule { }
