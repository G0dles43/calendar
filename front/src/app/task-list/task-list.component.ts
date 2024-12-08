import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DateTime } from 'luxon';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: { id: number, date: string, title: string }[] = [];
  @Input() selectedDate: DateTime | null = null;
  @Output() taskAdded = new EventEmitter<{ date: DateTime, task: string }>();

  // Filtrowanie zadań na podstawie wybranego dnia
  get filteredTasks() {
    return this.tasks.filter(task =>
      new Date(task.date).toDateString() === new Date(this.selectedDate?.toJSDate() || '').toDateString()
    );
  }

  constructor(public dialog: MatDialog, private taskService: TaskService) {}

  // Otwarcie formularza do dodania zadania
  openDialog() {
    if (this.selectedDate) {
      const dialogRef = this.dialog.open(TaskFormComponent, {
        data: { selectedDate: this.selectedDate.toJSDate() }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.taskAdded.emit(result);
        }
      });
    }
  }

  // Usuwanie zadania
  removeTask(taskId: number | undefined) {
    if (taskId != null) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        // Po usunięciu z API usuwamy zadanie z listy w interfejsie
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      });
    } else {
      console.error('Nie można usunąć zadania bez ID');
    }
  }

  sortTasks(ascending: boolean) {
    const compareFn = (a: { date: string; title: string }, b: { date: string; title: string }) => {
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
