import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, TaskListComponent]
})
export class CalendarComponent implements OnInit {
  today: DateTime = DateTime.local();
  firstDayOfMonth: DateTime = this.today.startOf('month');
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  daysOfMonth: DateTime[] = [];
  selectedDate: DateTime | null = null;
  tasks: any[] = [];

  constructor(private taskService: TaskService) {
    this.generateDaysOfMonth();
  }

  ngOnInit() {
    this.loadTasks();
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

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        date: DateTime.fromISO(task.date.toString()),
        priority: task.priority,
      }));
    });
  }


  addTask(task: { date: DateTime; task: string; priority: number }) {
    const newTask = {
      title: task.task,
      date: task.date,
      priority: task.priority,
    };
    this.taskService.addTask(newTask).subscribe(addedTask => {
      this.tasks.push({
        id: addedTask.id,
        title: addedTask.title,
        date: DateTime.fromISO(addedTask.date.toString()),
        priority: addedTask.priority,
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

  previousYear() {
    this.firstDayOfMonth = this.firstDayOfMonth.minus({ months: 12 });
    this.generateDaysOfMonth();
  }

  nextYear() {
    this.firstDayOfMonth = this.firstDayOfMonth.plus({ months: 12 });
    this.generateDaysOfMonth();
  }

  currentMonth(date: DateTime): boolean {
    return date.hasSame(this.firstDayOfMonth, 'month');
  }
}
