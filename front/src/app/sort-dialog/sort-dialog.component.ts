import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrl: './sort-dialog.component.css',
})
export class SortDialogComponent {
  constructor(public dialogRef: MatDialogRef<SortDialogComponent>) {}

  sort(property: string, ascending: boolean) {
    this.dialogRef.close({ property, ascending });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
