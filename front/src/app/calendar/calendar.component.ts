import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../services/task.service'; // Import serwisu
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent]
})
export class CalendarComponent implements OnInit {
  today: DateTime = DateTime.local();
  firstDayOfMonth: DateTime = this.today.startOf('month');
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  daysOfMonth: DateTime[] = [];
  selectedDate: DateTime | null = null;
  tasks: any[] = [];

  constructor(public dialog: MatDialog, private taskService: TaskService) {
    this.generateDaysOfMonth();
  }

  ngOnInit() {
    this.loadTasks(); // Wczytaj zadania przy inicjalizacji
  }

  generateDaysOfMonth() {
    this.daysOfMonth = [];
    let start = this.firstDayOfMonth.startOf('week');
    let end = this.firstDayOfMonth.endOf('month').endOf('week');
    let current = start;

    while (current <= end) {
      this.daysOfMonth.push(current);
      current = current.plus({ days: 1 });
    }
  }

  selectDay(day: DateTime) {
    this.selectedDate = day;
  }

  openDialog() {
    if (this.selectedDate) {
      const dialogRef = this.dialog.open(TaskFormComponent, {
        data: {
          selectedDate: this.selectedDate.toJSDate()
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.addTask(result);
        }
      });
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        date: DateTime.fromISO(task.date.toString())
      }));
    });
  }
  

  addTask(task: { date: DateTime; task: string }) {
    const newTask = {
      title: task.task,
      date: task.date
    };
    this.taskService.addTask(newTask).subscribe(addedTask => {
      this.tasks.push({
        id: addedTask.id,
        title: addedTask.title,
        date: DateTime.fromISO(addedTask.date.toString())
      });
    });
  }

  hasTasks(day: DateTime): boolean {
    return this.tasks.some(task => task.date.hasSame(day, 'day'));
  }

  previousMonth() {
    this.firstDayOfMonth = this.firstDayOfMonth.minus({ months: 1 });
    this.generateDaysOfMonth();
  }

  nextMonth() {
    this.firstDayOfMonth = this.firstDayOfMonth.plus({ months: 1 });
    this.generateDaysOfMonth();
  }

  currentMonth(date: DateTime): boolean {
    return date.hasSame(this.firstDayOfMonth, 'month');
  }
}
