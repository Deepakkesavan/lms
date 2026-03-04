import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import { TooltipComponent } from '../../../../reusable-templates/tooltip/tooltip.component';
import {
  TAppearance,
  approvalStatusKeys,
  leaveTypeKeys,
} from '../../../../shared/literal-types/literal-types';
import { ICatalog } from '../../../../shared/models/common';
import {
  IDashboardCardDetails,
  IHolidayDetails,
  ILeaveDetails,
} from '../../../../shared/models/dashboard';
import { SharedService } from '../../../../shared/shared.service';
import { ILeaveTypeColor } from '../../modal/employee.modal';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';

@Component({
  selector: 'lms-calendar',
  standalone: true,
  imports: [
    CommonModule,
    NgceComponentsModule,
    NgceIconModule,
    TooltipComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  // Injecting required services
  private route = inject(ActivatedRoute);
  private sharedService = inject(SharedService);
  private readonly dialogBridge = inject(DialogBridgeService);

  leaveDetails = input<ILeaveDetails[]>();
  leaveTypeColors = input<ILeaveTypeColor[]>();
  publicHolidaysList = input<IHolidayDetails[]>();
  leaveBalanceData = input<IDashboardCardDetails[] | null>(null);

  currentDate: Date = new Date();

  selectedDate!: Date;

  hoveredDate!: Date | null;

  leaveDataForspecifiedDate = signal<ILeaveDetails | null>(null);

  leaveHistoryData = signal<ILeaveDetails[]>([]);

  appearance: TAppearance = 'none';

  selectedLeaveTypeValue = signal<string>('');

  leaveBalanceBasedOnLeaveType = signal<IDashboardCardDetails | undefined>(
    undefined
  );

  applyLeaveCardStyles = {
    cursor: 'default',
    border: '1px solid rgb(229 ,231 ,235 , 31%)',
    'background-color': 'white',
    height: '100%',
    width: '130%',
  };

  leaveTypes = input<ICatalog[]>();

  getLeaveTypeValue(event: any) {
    this.selectedLeaveTypeValue.set(event);

    const leaveDetails = this.leaveBalanceData()?.find(
      (lb) => lb.leaveType === this.selectedLeaveTypeValue()
    );
    this.leaveBalanceBasedOnLeaveType.set(leaveDetails);
  }

  // Navigate to the previous or next month
  navigateMonth(direction: 'prev' | 'next'): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    );
  }

  // Method to get Day names for the calendar header (e.g., "Sun", "Mon", etc.)
  days(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  //Method to get the first day of the month (0 = Sunday, 1 = Monday, ...)
  firstDayOfMonth(): number {
    const firstDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    return firstDate.getDay();
  }

  // Get the day of the week for the first day of the month
  getFirstDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  // Get an array of days in the current month
  getDaysInMonthArray(): Date[] {
    const daysInMonth = this.getDaysInMonth(this.currentDate);
    return Array.from({ length: daysInMonth }, (x, i) => {
      const d = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        i + 1,
        5,
        30,
        0,
        0
      );
      return d;
    });
  }

  // Method to update hoverd date
  updateHoveredDate(date: Date): void {
    this.hoveredDate = date;
  }

  clearHoveredDate(): void {
    this.hoveredDate = null;
  }

  getDayBackground(day: any): string | undefined {
    if (this.isWeekend(day)) return this.sharedService.getColor('weekend');
    if (this.isHoliday(day)) return this.sharedService.getColor('holiday');
    if (this.isDrafted(day)) return this.sharedService.getColor('drafted');
    if (this.onLeave(day)) return this.sharedService.getColor('leave');
    if (this.onWrh(day)) return this.sharedService.getColor('wfh');

    return undefined;
  }

  isSpecialDay(day: Date): boolean {
    return this.isWeekend(day) ||
           this.isHoliday(day) ||
           this.onWrh(day) ||
           this.isDrafted(day) ||
           this.onLeave(day);
  }
  
  isNormalDay(day: Date): boolean {
    return !this.isSpecialDay(day);
  }

  //Method to check whether given date is weekedn or not
  isWeekend(date: Date): boolean {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return true;
    }
    return false;
  }

  // Method to check if a date is within a leave period
  onLeave(date: Date): boolean {
    const foundLeave = this.findLeaveDetails(date);
    //

    if (
      foundLeave &&
      foundLeave.leaveTypeKey !== leaveTypeKeys.WFH &&
      (foundLeave.leaveTypeKey === leaveTypeKeys.SICK ||
        foundLeave.leaveTypeKey === leaveTypeKeys.CASUAL ||
        foundLeave.leaveTypeKey === leaveTypeKeys.LOP ||
        foundLeave.leaveTypeKey === leaveTypeKeys.PRIVILEGE ||
        foundLeave.leaveTypeKey === leaveTypeKeys.PATERNITY ||
        foundLeave.leaveTypeKey === leaveTypeKeys.MATERNITY) &&
      foundLeave.approvalStatusKey !== approvalStatusKeys.CANCELLED &&
      foundLeave.approvalStatusKey !== approvalStatusKeys.REJECTED
    ) {
      return true;
    }

    return false;
  }

  onWrh(date: Date): boolean {
    const foundLeave = this.findLeaveDetails(date);
    if (
      foundLeave &&
      leaveTypeKeys.WFH === foundLeave.leaveTypeKey &&
      foundLeave.approvalStatusKey !== approvalStatusKeys.Drafted &&
      foundLeave.approvalStatusKey !== approvalStatusKeys.REJECTED
    ) {
      return true;
    }

    return false;
  }
  isHoliday(date: Date): boolean {
    if (!date) {
      return false;
    };

    const normalizedDate = this.normalizeDate(date);

    return (
      this.publicHolidaysList()?.some((holiday) => {
        const holidayDate = this.normalizeDate(holiday.date);
        return normalizedDate?.getTime() === holidayDate?.getTime();
      }) ?? false
    );
  }

  isDrafted(date: Date): boolean {
    if (!date) {
      return false;
    };

    const foundLeave = this.findLeaveDetails(date);

    if (
      foundLeave &&
      foundLeave.approvalStatusKey === approvalStatusKeys.Drafted
    ) {
      return true;
    }

    return false;
  }

  // Get the number of days in the current month
  getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  normalizeDate(date: Date | string): Date | undefined {
    if (!date) {
      return;
    };
    const d = date instanceof Date ? date : new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // time = 00:00:00
  }

  findLeaveDetails(date: Date): ILeaveDetails | undefined {
    const targetDate = this.convertToISOString(date)!;
    
    const foundLeave = this.leaveDetails()?.find((leaveData) => {
      const start = this.convertToISOString(leaveData.startDate)!;
      const end = this.convertToISOString(leaveData.endDate)!;
      const isWithinRange = targetDate >= start && targetDate <= end;
      const isValidStatus =
        leaveData.approvalStatusKey !== approvalStatusKeys.CANCELLED &&
        leaveData.approvalStatusKey !== approvalStatusKeys.REJECTED;

      return isWithinRange && isValidStatus;
    });

    return foundLeave;
  }

  convertToISOString(date: Date | string, isEndDate = false): string | null {
    if (!date) {
      return null;
    };

    const d = new Date(date);

    // Set time part (in local time)
    if (isEndDate) {
      d.setHours(23, 59, 59, 0);
    } else {
      d.setHours(0, 0, 0, 0);
    }

    // Convert to UTC by subtracting timezone offset
    const utcDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

    return utcDate.toISOString();
  }

  updateLeaveDataForspecifiedDate() {
    const targetDateString = this.convertToISOString(this.selectedDate);
    if (!targetDateString) {
      return;
    }

    const targetDate = new Date(targetDateString);
    const leaveHistory = this.leaveHistoryData();

    const matchingLeave = leaveHistory?.find((leaveData) => {
      const startDate = new Date(this.convertToISOString(leaveData.startDate)!);
      const endDate = new Date(this.convertToISOString(leaveData.endDate)!);

      return (
        targetDate >= startDate &&
        targetDate <= endDate &&
        leaveData.approvalStatusKey !== approvalStatusKeys.CANCELLED &&
        leaveData.approvalStatusKey !== approvalStatusKeys.REJECTED
      );
    });

    if (matchingLeave) {
      this.leaveDetailsForSelectedDate.set(matchingLeave);
      this.selectedLeaveTypeValue.set(
        this.getLeaveTypeValueFromKey(matchingLeave.leaveTypeKey)
      );

      const leaveDetails = this.leaveBalanceData()?.find(
        (lb) => lb.leaveType === this.selectedLeaveTypeValue()
      );
      this.leaveBalanceBasedOnLeaveType.set(leaveDetails);
    } else {
      this.leaveDataForspecifiedDate.set(null);
    }
  }

  getLeaveTypeValueFromKey(key: string) {
    let leaveTypeValue = '';

    this.leaveTypes()!.forEach((l) => {
      if (l.key === key) leaveTypeValue = l.value;
    });
    return leaveTypeValue;
  }

  leaveDetailsForSelectedDate = signal<ILeaveDetails | null>(null);

  formatLeaveDetailsForSelectedDate(leaveInfo: ILeaveDetails) {
    return {
      startDate: this.normalizeDate(leaveInfo.startDate),
      endDate: this.normalizeDate(leaveInfo.endDate),
      leaveType: this.getLeaveTypeValueFromKey(leaveInfo.leaveTypeKey),
      reason: leaveInfo.reason,
    };
  }

  onDateClick(date: Date) {
    this.selectedDate = date;
    const normalizedDate = this.normalizeDate(date);
    const leaveDetailsForSelectedDate = normalizedDate
      ? this.leaveDetails()?.find((l) => {
          const start = this.normalizeDate(l.startDate);
          const end = this.normalizeDate(l.endDate);
          return (
            start && end && normalizedDate >= start && normalizedDate <= end
          );
        })
      : undefined;

    if (leaveDetailsForSelectedDate) {
      this.dialogBridge.requestOpenForm({
        selectedDate: this.selectedDate,
        header: `Apply Leave`,
        formType: 'add',
        requestedBy: 'request-button',
        data: this.formatLeaveDetailsForSelectedDate(
          leaveDetailsForSelectedDate
        ),
      });
    } else {
      this.dialogBridge.requestOpenForm({
        selectedDate: this.selectedDate,
        header: `Apply Leave`,
        formType: 'add',
        requestedBy: 'request-button',

        isAlreadyApplied: true,
      });
    }

    this.updateLeaveDataForspecifiedDate();
  }
}
