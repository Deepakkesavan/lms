import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import {
  IDashboardCardDetails,
  IHolidayDetails,
  ILeaveDetails,
} from '../../../../shared/models/dashboard';
import { ILeaveTypeColor } from '../../modal/employee.modal';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { ICatalog } from '../../../../shared/models/common';

@Component({
  selector: 'lms-leave-request',
  standalone: true,
  imports: [
    CalendarComponent,
    NgceComponentsModule,
    NgceIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.scss',
})
export class LeaveRequestComponent {
  private readonly dialogBridge = inject(DialogBridgeService);

  leaveRequestHeader = 'Apply for Leave';

  leaveRequestButton = 'Request';

  readonly leaveBalance = input<IDashboardCardDetails[]>([]);
  readonly holidays = input<IHolidayDetails[]>();
  readonly leaveDetails = input<ILeaveDetails[]>();
  readonly leaveTypeColors = input<ILeaveTypeColor[]>();
  leaveTypes = input<ICatalog[]>();

  applyLeaveCardStyles = {
    cursor: 'default',
    border: '1px solid rgb(229 ,231 ,235 , 31%)',
    'background-color': 'white',
    height: '100%',
    width: '130%',
  };

  onRequestClick() {
    this.dialogBridge.requestOpenForm({
      formType: 'add',
      requestedBy: 'request-button',
      selectedDate: new Date(),
    });
  }
}
