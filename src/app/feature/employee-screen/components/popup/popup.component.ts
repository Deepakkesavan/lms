import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  DialogConfig,
  DialogService,
  NgceComponentsModule,
} from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';

import { SimpleDataStatComponent } from '../../../../reusable-templates/simple-data-stat/simple-data-stat.component';
import { ReusableGridComponent } from '../../../../reusable-templates/reusable-grid/reusable-grid.component';
import { ApplyLeaveFormComponent } from '../apply-leave-form/apply-leave-form.component';

import {
  IDashboardCardDetails,
  ILeaveDetails,
} from '../../../../shared/models/dashboard';
import { ICatalog } from '../../../../shared/models/common';
import { approvalStatusKeys } from '../../../../shared/literal-types/literal-types';

import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { EmployeeStoreService } from '../../../../store/employee-store.service';

@Component({
  selector: 'lms-popup',
  standalone: true,
  imports: [
    CommonModule,
    NgceComponentsModule,
    NgceIconModule,
    SimpleDataStatComponent,
    ReusableGridComponent,
    ApplyLeaveFormComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  /* ---------------- TAB CONFIG ---------------- */

  tabArray = [
    {
      headerName: 'Apply Leave',
      headerIconClass: 'ngce-calendar-plus-o',
      content: 'applyLeave',
    },
    {
      headerName: 'Leave History',
      headerIconClass: 'ngce-history',
      content: 'fullLeaveHistory',
    },
  ];

  tabHeaderStyles = { padding: '0.5rem 0' };
  tabContentStyles = { display: 'flex', height: '70vh', color: 'black' };

  /* ---------------- DIALOG TEMPLATES ---------------- */

  applyLeaveAndLeaveHistory = viewChild<TemplateRef<any>>(
    'applyLeaveAndLeaveHistory'
  );
  addLeaveReqTemplate = viewChild<TemplateRef<any>>('addLeaveReqTemplate');
  editLeaveReqTemplate = viewChild<TemplateRef<any>>('editLeaveReqTemplate');

  /* ---------------- DEPENDENCIES ---------------- */

  private readonly dialogService = inject(DialogService);
  private readonly bridge = inject(DialogBridgeService);
  private readonly employeeStore = inject(EmployeeStoreService);

  /* ---------------- STATE ---------------- */

  selectedLeaveType = signal<string | null>(null);
  selectedLeaveTypeBalance = signal<IDashboardCardDetails | null>(null);
  requestedLeaveDays = 0;
  showLeaveDayType = signal(true);
  existingLeaveDetails = signal<ILeaveDetails | null>(null);

  /* ---------------- CATALOG DATA ---------------- */

  leaveTypes = computed(
    () => this.employeeStore.catalogData()?.catalogs?.Leave ?? []
  );

  approvalTypes = computed(
    () => this.employeeStore.catalogData()?.catalogs?.['Approval Status'] ?? []
  );

  leaveDayTypes = computed(
    () => this.employeeStore.catalogData()?.catalogs?.LeaveDayType ?? []
  );

  /* ---------------- STORE DATA ---------------- */

  allLeaveBalances = computed(
    () => this.employeeStore.leaveBalanceData()?.card.LeaveTypeCard ?? []
  );

  allLeaveHistory = computed(
    () => this.employeeStore.employeeLeaveDetails() ?? []
  );

  constructor() {
    this.employeeStore.loadLeaveBalance();
    this.initializeEffects();
  }

  /* ================= EFFECTS ================= */

  private initializeEffects() {
    // Handle open form requests
    effect(() => {
      const request = this.bridge.openFormRequest();
      if (!request) return;

      if (request.requestedBy === 'card') {
        this.selectedLeaveType.set(request.leaveType!);
        request.header = 'Leave Details';
      }

      if (request.requestedBy === 'edit') {
        this.existingLeaveDetails.set(request.data);
      }

      this.openLeaveForm(
        request.data,
        request.selectedDate,
        request.leaveType,
        request.header,
        request.formType,
        request.requestedBy
      );

      this.bridge.closeFormRequest();
    });

    // Update leave balance when leave type changes
    effect(() => {
      const leaveType = this.selectedLeaveType();
      if (!leaveType) return;

      const balance = this.allLeaveBalances().find(
        (b) => b.leaveType === leaveType
      );
      this.selectedLeaveTypeBalance.set(balance ?? null);
    });
  }

  /* ================= FORM EVENTS ================= */

  onFormValueChange(event: { value: any; isValid: boolean }) {
    this.selectedLeaveType.set(event.value.leaveTypeValue);

    if (!event.value.startDate || !event.value.endDate) {
      this.requestedLeaveDays = 0;
      return;
    }

    event.value.startDate !== event.value.endDate
      ? this.showLeaveDayType.set(false)
      : this.showLeaveDayType.set(true);

    if (event.value.leaveDayTypeValue === 'HALF_DAY') {
      this.requestedLeaveDays = 0.5;
    } else {
      const diff =
        (new Date(event.value.endDate).getTime() -
          new Date(event.value.startDate).getTime()) /
        (1000 * 60 * 60 * 24);
      this.requestedLeaveDays = diff + 1;
    }
  }

  onFormSubmit(event: any) {
    const leaveTypeKey = this.getLeaveTypeKey(event.leaveTypeValue)!;
    const leaveDayTypeKey = this.getLeaveDayType(event.leaveDayTypeValue);

    const payload: ILeaveDetails = {
      startDate: event.startDate,
      endDate: event.endDate,
      leaveTypeKey,
      reason: event.reason,
      isHalfDay: leaveDayTypeKey === 'half',
      leaveId: this.existingLeaveDetails()?.leaveId!,
    };

    const existing = this.getLeaveDetailsForSelectedDate(
      event.startDate,
      event.endDate
    );

    if (existing?.approvalStatusKey === approvalStatusKeys.Drafted) {
      const { requestedDays, ...oldLeave } = existing;
      console.log(payload);

      this.employeeStore.updateLeaveDetails(payload);
    } else {
      this.employeeStore.addLeaveDetails(payload);
    }

    this.dialogService.closeDialog();
  }

  onSaveDraft(event: any, isEdit = false) {
    const leaveTypeKey = this.getLeaveTypeKey(event.leaveTypeValue)!;
    const leaveDayTypeKey = this.getLeaveDayType(event.leaveDayTypeValue);

    const payload: ILeaveDetails = {
      startDate: event.startDate,
      endDate: event.endDate,
      leaveTypeKey,
      reason: event.reason,
      approvalStatusKey: approvalStatusKeys.Drafted,
      isHalfDay: leaveDayTypeKey === 'half',
      leaveId: '',
    };
    // this.employeeStore.saveLeaveDetailsAsDraft(payload);

    if (isEdit && this.existingLeaveDetails()) {
      payload.leaveId = this.existingLeaveDetails()?.leaveId!;
      this.employeeStore.saveLeaveDetailsAsDraft(payload);
    } else {
      this.employeeStore.saveLeaveDetailsAsDraft(payload);
    }
  }

  /* ================= DIALOG ================= */

  openLeaveForm(
    data?: ILeaveDetails,
    selectedDate?: Date,
    leaveType?: string,
    headerContent = 'Apply Leave',
    formType: 'add' | 'edit' = 'add',
    requestedBy = 'request-button'
  ) {
    let template: TemplateRef<any>;

    if (requestedBy === 'card') {
      template = this.applyLeaveAndLeaveHistory()!;
    } else if (formType === 'edit') {
      template = this.editLeaveReqTemplate()!;
    } else {
      template = this.addLeaveReqTemplate()!;
    }

    if (formType === 'edit' && data) {
      this.existingLeaveDetails.set(data);
    } else if (selectedDate) {
      this.existingLeaveDetails.set({
        startDate: selectedDate.toISOString().split('T')[0],
        endDate: selectedDate.toISOString().split('T')[0],
        leaveTypeValue: leaveType,
      } as any);
    }

    const dialogConfig: DialogConfig = {
      header: headerContent,
      content: template,
      closeOnBackdropClick: true,
      closeButton: true,
      draggable: false,
      styles: {
        dialog: { padding: '0' },
        header: {
          backgroundColor: 'var(--neutral-light)',
          padding: '0.8rem',
          width: '100%',
          fontSize: '0.8rem',
        },
        body: {
          padding: '0.5rem',
          backgroundColor: 'var(--bg-surface)',
          width: '60vw',
        },
      },
    };

    this.dialogService.openDialog(dialogConfig);

    this.dialogService.afterClose().subscribe(() => {
      this.existingLeaveDetails.set(null);
      this.selectedLeaveType.set(null);
      this.requestedLeaveDays = 0;
      this.selectedLeaveTypeBalance.set(null);
    });
  }

  /* ================= HELPERS ================= */

  getLeaveTypeKey(value: string): string | undefined {
    return this.leaveTypes().find((i: ICatalog) => i.value === value)?.key;
  }

  getLeaveDayType(value: string): string | undefined {
    return this.leaveDayTypes().find((i: ICatalog) => i.value === value)?.key;
  }

  getLeaveDetailsForSelectedDate(startDate: string, endDate: string) {
    return this.allLeaveHistory().find(
      (l) =>
        l.startDate.split('T')[0] === startDate ||
        l.endDate.split('T')[0] === endDate
    );
  }
}
