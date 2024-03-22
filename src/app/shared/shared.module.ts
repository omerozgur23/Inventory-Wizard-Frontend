import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog/yes-no-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    YesNoDialogComponent
  ],
  imports: [
    CommonModule,    
    MatIconModule,
    MatDialogModule,
  ]
})
export class SharedModule { }
