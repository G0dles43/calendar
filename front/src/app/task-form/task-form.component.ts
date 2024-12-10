import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateTime} from 'luxon';
import { ForbiddenWordValidatorDirective } from './forbidden-word-validator.directive';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ForbiddenWordValidatorDirective]
})
export class TaskFormComponent implements OnInit{
  selectedDate: Date; // Typ Date
  taskForm: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date }
  ) {
    if (data && data.selectedDate) {
      this.selectedDate = new Date(data.selectedDate);
    } else {
      this.selectedDate = new Date();
    }
  }

  ngOnInit() {
    this.taskForm = new FormGroup({
      task: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]),})
  }

  submitForm() {
    if(this.taskForm.valid) {
      this.dialogRef.close({date: this.selectedDate, task: this.taskForm.value.task});
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
