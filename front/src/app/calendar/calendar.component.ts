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
  imports: [CommonModule, TaskListComponent],
})
export class CalendarComponent implements OnInit {
  today: DateTime = DateTime.local();
  firstDayOfMonth: DateTime = this.today.startOf('month');
  weekDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  daysOfMonth: DateTime[] = [];
  monthsOfYear: DateTime[] = [];
  selectedDate: DateTime | null = null;
  tasks: any[] = [];
  currentView: 'month' | 'year' = 'month';

  constructor(private taskService: TaskService) {
    this.generateDaysOfMonth();
    this.generateMonthsOfYear();
  }

  ngOnInit() {
    this.loadTasks();
  }

  getTasksForDay(day: DateTime): any[] {
    return this.tasks.filter((task) => task.date.hasSame(day, 'day'));
  }

  hasCategoryForDay(day: DateTime, category: string): boolean {
    return this.tasks.some(
      (task) => task.date.hasSame(day, 'day') && task.category === category
    );
  }

  setView(view: 'month' | 'year') {
    this.currentView = view;
  }

  generateDaysForMonth(month: DateTime): DateTime[] {
    const days = [];
    const start = month.startOf('month').startOf('week');
    const end = month.endOf('month').endOf('week');
    let current = start;

    while (current <= end) {
      days.push(current);
      current = current.plus({ days: 1 });
    }

    return days;
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

  generateMonthsOfYear() {
    this.monthsOfYear = [];
    for (let i = 0; i < 12; i++) {
      this.monthsOfYear.push(this.today.startOf('year').plus({ months: i }));
    }
  }

  selectMonth(month: DateTime) {
    this.firstDayOfMonth = month.startOf('month');
    this.currentView = 'month';
    this.generateDaysOfMonth();
  }

  selectDay(day: DateTime) {
    this.selectedDate = day;
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        date: DateTime.fromISO(task.date.toString()),
        priority: task.priority,
        category: task.category,
      }));
    });
  }

  addTask(task: {
    date: DateTime;
    task: string;
    priority: number;
    category: 'entertainment' | 'regular' | 'mandatory';
  }) {
    const newTask = {
      title: task.task,
      date: task.date,
      priority: task.priority,
      category: task.category,
    };
    this.taskService.addTask(newTask).subscribe((addedTask) => {
      this.tasks.push({
        id: addedTask.id,
        title: addedTask.title,
        date: DateTime.fromISO(addedTask.date.toString()),
        priority: addedTask.priority,
        category: addedTask.category,
      });
    });
  }

  hasTasks(day: DateTime): boolean {
    return this.tasks.some((task) => task.date.hasSame(day, 'day'));
  }

  //Calendar buttons
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
  onTaskRemoved(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
  getHighestPriorityCategoryForDay(day: DateTime): string | null {
    const tasksForDay = this.getTasksForDay(day);

    if (tasksForDay.some((task) => task.category === 'mandatory')) {
      return 'mandatory';
    }
    if (tasksForDay.some((task) => task.category === 'regular')) {
      return 'regular';
    }
    if (tasksForDay.some((task) => task.category === 'entertainment')) {
      return 'entertainment';
    }

    return null;
  }



}
