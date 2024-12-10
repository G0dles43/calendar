import { Component, Inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {DateTime} from 'luxon';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEditComponent {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: { id: number; title: string; } }
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(data.task.title, [Validators.required, Validators.minLength(3)]),
    });
  }

  submitForm() {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.data.task,
        title: this.taskForm.value.title
      };
      this.dialogRef.close(updatedTask); // Zwracamy zaktualizowany task
    }
  }

  close() {
    this.dialogRef.close();
  }
}
