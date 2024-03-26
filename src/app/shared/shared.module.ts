import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { CreateComponent } from './components/forms/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog/yes-no-dialog.component';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    // YesNoDialogComponent
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MatIconModule,
    // MatDialogModule,
  ],
  exports: [
    TableComponent,
    CreateComponent,
  ]
})
export class SharedModule { }
