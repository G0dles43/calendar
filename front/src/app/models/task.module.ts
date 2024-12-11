import {DateTime} from 'luxon';

export interface Task {
  id?: number;
  title: string;
  date: DateTime;
  priority: number;
}
