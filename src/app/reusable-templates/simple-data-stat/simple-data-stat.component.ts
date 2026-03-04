import {
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { IDashboardCardDetails } from '../../shared/models/dashboard';

interface ISimpleCardConfig {
  content: any;
  data: any;
}

@Component({
  selector: 'lms-simple-data-stat',
  standalone: true,
  imports: [NgceComponentsModule],
  templateUrl: './simple-data-stat.component.html',
  styleUrl: './simple-data-stat.component.scss',
})
export class SimpleDataStatComponent {
  data = input<IDashboardCardDetails>();

  currentDate = signal<Date>(new Date());

  leaveReqDays = input<number>();

  leaveTypeKey = input<string | null>();

  content = signal<ISimpleCardConfig[]>([]);

  cardStylesColor = signal<string>('pink');

  constructor() {
    effect(() => {
      const available = this.data()?.available ?? 0;
      const booked = this.leaveReqDays() ?? 0;
      const balanceAfterBooking = available - booked;
      this.content.set([
        {
          content: `As on ${this.formatDate(this.currentDate())}`,
          data: 'Day(s)',
        },
        { content: 'Available Balance', data: available },
        { content: 'Current Booking', data: booked },
        {
          content: 'Balance after current booking',
          data: balanceAfterBooking,
        },
      ]);

      this.cardStylesColor.set(this.data()?.iconColor!);
    });
  }

  // Card styling
  cardStyles = {
    padding: '1.5rem',
    'padding-bottom': '.5rem',
    width: '20rem',
    cursor: 'default',
    border: '1px solid #e5e7eb',
    height: 'auto',
    'min-height': '9.85rem',
    'border-left': `4px solid ${this.cardStylesColor()} !important`,
  };

  cardHeaderStyles = {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: '.2rem', // Reduced from .5rem
    overflow: 'visible',
  };

  cardContentStyles = {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: '0.1rem', // Reduced from .3rem
  };

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const day = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
