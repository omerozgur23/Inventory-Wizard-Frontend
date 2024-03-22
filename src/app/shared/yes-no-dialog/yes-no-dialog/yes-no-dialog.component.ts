import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.scss'
})
export class YesNoDialogComponent {
  question = '';
  constructor(public dialogRef: MatDialogRef<YesNoDialogComponent>) {}

  buttonYesClick() {
    this.dialogRef.close({"result": "yes"});
  }
  buttonNoClick() {
    this.dialogRef.close({"result": "no"});
  }
}
