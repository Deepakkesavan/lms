import {
  Component,
  TemplateRef,
  viewChild,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { IPendingApproval } from '../../models/hr';
import { CommonModule } from '@angular/common';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { UserNameWithIconComponent } from '../../../../reusable-templates/user-name-with-icon/user-name-with-icon.component';
import { NgceIconModule } from '@clarium/ngce-icon';

@Component({
  selector: 'lms-pending-approvals',
  standalone: true,
  imports: [
    CommonModule,
    NgceComponentsModule,
    UserNameWithIconComponent,
    NgceIconModule,
  ],
  templateUrl: './pending-approvals.component.html',
  styleUrl: './pending-approvals.component.scss',
})
export class PendingApprovalsComponent {
  data = input<IPendingApproval>();
  id = signal<string | undefined>('');

  employeeID = viewChild<TemplateRef<string>>('employeeID');

  constructor() {
    effect(
      () => {
        this.id.set(this.data()!.employeeId);
      },
      { allowSignalWrites: true }
    );
  }

  getData = computed(() => {
    const tempData: IPendingApproval = this.data()!;
    const array = tempData?.employeeName.split(' ');
    tempData.firstName = array[0];
    tempData.lastName = array[1];
    return tempData;
  });

  IdStyling = {
    color: 'rgb(100 ,116, 139, 1)',
    'font-size': '.87rem',
    'font-weight': '500',
    'line-height': '1.25rem',
  };

  getIdStyling = computed(() => {
    return this.IdStyling;
  });

  getDays = computed(() => {
    const start = new Date(this.data()!.startDate);
    const end = new Date(this.data()!.endDate);
    // Normalize time to avoid timezone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to make it inclusive

    return dayDiff;
  });

  readonly cardStyle = {
    padding: '.8rem',
    width: 'auto',
    cursor: 'default',
    border: '1px solid rgb(226, 232, 240, 1)',
    'background-color': 'var(--light-light) !important',
    height: 'auto',
    'border-radius': '.5rem',
    'box-shadow': 'rgba(0, 0, 0, 0.2) 0px 0px 1.2px 0px',
  };

  readonly cardContentStyle = {
    display: 'flex',
    'flex-flow': 'column nowrap',
    'justify-content': 'start',
    gap: '.5rem',
  };

  readonly leaveNameStyle = {
    'font-size': '0.9rem',
    'font-weight': '500',
    color: 'var(--color-dark)',
  };

  readonly leaveDetailStyle = {
    display: 'flex',
    'flex-flow': 'row nowrap',
    'justify-content': 'space-between',
  };

  readonly calendarStyle = {
    display: 'flex',
    'flex-flow': 'row nowrap',
    'justify-content': 'start',
    gap: '.2rem',
    'align-items': 'center',
  };

  readonly dateRangeStyle = {
    color: 'var(--color-gray-400)', //#4a5568
    'font-size': '14px',
  };

  readonly dayStyle = {
    display: 'inline-flex',
    'align-items': 'center',
    gap: '0.4rem',
    'font-size': '0.875rem',
    color: 'rgb(37, 99, 235)',
  };

  readonly dotStyle = {
    height: '0.5rem',
    width: '0.5rem',
    'border-radius': '50%',
    'background-color': 'rgb(37, 99, 235)',
    display: 'inline-block',
  };
}
