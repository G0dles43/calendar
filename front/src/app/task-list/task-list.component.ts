import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DateTime } from 'luxon';
import { TaskService } from '../services/task.service';
import {TaskEditComponent} from '../task-edit/task-edit.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskEditComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: { id: number, date: string, title: string, priority: number }[] = [];
  @Input() selectedDate: DateTime | null = null;
  @Output() taskAdded = new EventEmitter<{ date: DateTime, task: string, priority: number }>();

  errorMessage: string | null = null;

  get filteredTasks() {
    return this.tasks.filter(task =>
      DateTime.fromISO(task.date).toFormat('yyyy-MM-dd') === this.selectedDate?.toFormat('yyyy-MM-dd')
    );
  }

  constructor(public dialog: MatDialog, private taskService: TaskService) {}

  openDialog() {
    this.errorMessage = null;

    if (!this.selectedDate) {
      this.errorMessage = 'Select date!';
      alert(this.errorMessage);
      return;
    }

    const today = DateTime.now().startOf('day');
    const selectedDate = this.selectedDate.startOf('day');

    if (selectedDate < today) {
      this.errorMessage = 'You cannot add a task to a past date!';
      alert(this.errorMessage);
      return;
    }

    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { selectedDate: this.selectedDate.toJSDate() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskAdded.emit(result);
      }
    });
  }

  openEditDialog(task: { id: number; title: string; priority: number }) {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      data: { task },
    });

    dialogRef.afterClosed().subscribe((updatedTask) => {
      if (updatedTask) {
        this.taskService.updateTask(updatedTask.id, updatedTask).subscribe(() => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index > -1) {
            this.tasks[index] = updatedTask;
          }
        });
      }
    });
  }

  removeTask(taskId: number | undefined) {
    if (taskId != null) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      });
    } else {
      console.error('Nie można usunąć zadania bez ID');
    }
  }

  sortTasks(ascending: boolean) {
    const compareFn = (a: { title: string }, b: { title: string; }) => {
      const valueA = a.title.charAt(0).toLowerCase();
      const valueB = b.title.charAt(0).toLowerCase();
      if (valueA < valueB) {
        return ascending ? -1 : 1;
      }
      if (valueA > valueB) {
        return ascending ? 1 : -1;
      }
      return 0;
    };
    this.tasks.sort(compareFn);
  }
}
