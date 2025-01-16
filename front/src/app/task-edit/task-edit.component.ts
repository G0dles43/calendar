import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ForbiddenWordValidatorDirective } from '../task-form/forbidden-word-validator.directive';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    ForbiddenWordValidatorDirective,
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css',
})
export class TaskEditComponent implements OnChanges {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task: {
        id: number;
        title: string;
        priority: number;
        category: 'entertainment' | 'regular' | 'mandatory';
      };
    }
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(data.task.title, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40),
      ]),
      priority: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        priority: this.data.task.priority,
        category: this.data.task.category,
      });
    }
  }

  submitForm() {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.data.task,
        title: this.taskForm.value.title,
        priority: this.taskForm.value.priority,
        category: this.taskForm.value.category,
      };
      this.dialogRef.close(updatedTask);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
