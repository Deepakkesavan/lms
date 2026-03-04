import { DatePipe } from '@angular/common';
import {
  Component,
  TemplateRef,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { IGridConfig, NgceComponentsModule } from '@clarium/ngce-components';
import { ICatalog } from 'app/shared/models/common';
import { ILeaveDetails, ILeaveHistoryGrid } from 'app/shared/models/dashboard';

@Component({
  selector: 'lms-reusable-grid',
  standalone: true,
  imports: [NgceComponentsModule, DatePipe],
  templateUrl: './reusable-grid.component.html',
  styleUrl: './reusable-grid.component.scss',
})
export class ReusableGridComponent {
  startDate = viewChild<TemplateRef<any>>('startDate');
  endDate = viewChild<TemplateRef<any>>('endDate');
  leaveType = viewChild<TemplateRef<any>>('leaveType');
  approvalStatus = viewChild<TemplateRef<any>>('approvalStatus');
  requestedDays = viewChild<TemplateRef<any>>('requestedDays');

  gridData = input<ILeaveDetails[]>();

  leaveHistory = signal<ILeaveDetails[] | []>([]);

  gridFields = input<ILeaveHistoryGrid>();

  gridConfig = signal<IGridConfig | null>(null);

  selectedLeaveType = signal<string>('');

  leaveTypes = input<ICatalog[] | []>([]);
  approvalTypes = input<ICatalog[] | []>([]);

  constructor() {
    effect(() => {
      if (this.gridData()) {
        this.initializeGrid();
      }
    });

    effect(() => {
      if (this.selectedLeaveType()) {
        this.updateLeaveBalAndHistory(this.selectedLeaveType());
      }
    });
  }
  private updateLeaveBalAndHistory(leaveTypeKey: string) {
    const history = this.gridData()!.filter(
      (l) => l.leaveTypeKey === leaveTypeKey
    );
    this.leaveHistory.set(history);
  }
  private initializeGrid() {
    this.gridConfig.set({
      columns: [
        {
          field: 'leaveType',
          header: 'Leave Type',
          customTemplate: this.leaveType(),
        },
        {
          field: 'startDate',
          header: 'Start Date',
          customTemplate: this.startDate(),
        },
        {
          field: 'endDate',
          header: 'End Date',
          customTemplate: this.endDate(),
        },
        {
          field: 'requestedDays',
          header: 'Days',
          customTemplate: this.requestedDays(),
        },
        { field: 'reason', header: 'Reason' },
        {
          field: 'approvalStatus',
          header: 'Approval Status',
          customTemplate: this.approvalStatus(),
        },
      ],
      data: this.gridData() ?? [],
      pagination: {
        enabled: true,
        defaultVariant: false,
        pageDetails: true,
        pageSize: 5,
      }
    });
  }

  getLeaveTypeKey(value: string): string | undefined {
    return this.leaveTypes().find((i: ICatalog) => i.value === value)?.key;
  }

  getLeaveTypeValue(key: string): string {
    return this.leaveTypes().find((i: ICatalog) => i.key === key)?.value ?? '';
  }

  getApprovalStatusValue(key: string): string {
    return (
      this.approvalTypes().find((a: ICatalog) => a.key === key)?.value ?? ''
    );
  }
}
