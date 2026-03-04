import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import {
  DialogConfig,
  DialogService,
  NgceComponentsModule,
} from '@clarium/ngce-components';
import { ILeaveDetails } from '../../../../shared/models/dashboard';
import { StatusComponent } from '../../../../reusable-templates/status/status.component';
import { approvalStatusKeys } from '../../../../shared/literal-types/literal-types';
import { SharedService } from '../../../../shared/shared.service';
import { ICatalog } from '../../../../shared/models/common';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { MenuComponent } from '../../../../reusable-templates/menu/menu/menu.component';
import { EmployeeStoreService } from '../../../../store/employee-store.service';

@Component({
  selector: 'lms-latest-leaves',
  standalone: true,
  imports: [
    CommonModule,
    NgceIconModule,
    NgceComponentsModule,
    StatusComponent,
    MenuComponent,
  ],
  providers: [DatePipe],
  templateUrl: './latest-leaves.component.html',
  styleUrl: './latest-leaves.component.scss',
})
export class LatestLeavesComponent {
  readonly latestLeavesHeader: string = 'My Latest Leaves';

  dialogContent = viewChild<TemplateRef<any>>('dialogContent');

  private readonly sharedService = inject(SharedService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly employeeStoreService = inject(EmployeeStoreService);

  leaveTypes = input<ICatalog[]>([]);
  latestLeaves = input<ILeaveDetails[]>([]);
  latestLeavesData = signal<ILeaveDetails[]>([]);
  index = -1;
  cancelDialogContent = `Are you sure you want to cancel this request? \n\n This action cannot be undone and the request will be permanently marked as cancelled`;
  confirm = 'Confirm';
  keepRequest = 'Keep Request';
  notFoundContent = `No leave records found`;

  // Styles
  cardStyles = {
    display: 'flex',
    'flex-flow': 'column nowrap',
    padding: '.5rem 0.9rem',
    'margin-top': '10px',
    cursor: 'default',
    border: '0 solid #e5e7eb',
    'box-shadow': ' 0px 0px 3px 0 rgba(0, 0, 0, .2)',
    'background-color': 'var(--light-light) !important',
    width: 'auto',
  };

  stripTime(dateStr: string): Date {
    const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  statusAndMenuStyle = {
    display: 'flex',
    'flex-flow': 'row nowrap',
    gap: '.08rem',
    'align-items': 'center',
  };

  confirmButtonStyle = {
    padding: '.5rem 1rem',
    'border-radius': '.25rem',
    display: 'inline-flex',
    'justify-content': 'center',
    'align-items': 'center',
  };

  keepRequestButtonStyle = {
    padding: '.5rem 1rem',
    'border-radius': '.25rem',
    display: 'inline-flex',
    'justify-content': 'center',
    'align-items': 'center',
  };

  menuItems = ['All', 'Approved', 'Rejected', 'Pending', 'Cancelled', 'Draft'];
  option = signal<string>('All');

  draftMenuItems = ['Edit', 'Cancel Request'];
  approvalMenuItems = ['Cancel Request'];

  menuStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '200px',
  };

  itemStyle = {
    color: '#333',
    padding: '10px',
    fontSize: '14px',
  };

  constructor() {
    effect(() => {
      this.latestLeavesData.set(this.latestLeaves());
    });
  }
  leaveDataForSpecificDate = signal<ILeaveDetails | null>(null);

  getDays(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize to local date (remove time part)
    const startLocal = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endLocal = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // Calculate difference in milliseconds
    const diffInMs = endLocal.getTime() - startLocal.getTime();

    // Convert ms to full days and add 1 to make it inclusive
    return diffInMs / (1000 * 60 * 60 * 24) + 1;
  }

  getLeaveType(key: string) {
    return this.sharedService.getCatalogUsingKey(this.leaveTypes(), key)?.value;
  }

  getDialogConfig(): DialogConfig {
    const dialogconfig: DialogConfig = {
      content: this.dialogContent()!,
      header: 'Confirmation',
      dialogType: 'classic',
      width: '650px',
      height: 'fit-content',
      closeOnBackdropClick: false,
      accessibility: true,
      draggable: true,
      closeButton: true,

      styles: {
        dialog: { padding: '0' },
        header: {
          backgroundColor: 'var(--neutral-light)',
          padding: '10px',
        },
        body: {
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: 'none !important',
        },
      },
    };
    return dialogconfig;
  }

  onActionClick(choice: string) {
    switch (choice) {
      case this.confirm: {
        // write API call here.
        const existingData: ILeaveDetails = this.filteredLeaves()[this.index];
        this.employeeStoreService.cancelLeave(existingData.leaveId);

        break;
      }
      case this.keepRequest: {
        this.dialogService.closeDialog();
        break;
      }
    }
  }

  private readonly dialogBridge = inject(DialogBridgeService);

  onLeaveItemSelected(value: string, i: number, data?: ILeaveDetails) {
    this.index = i;
    switch (value) {
      case 'Cancel Request':
        this.dialogService.openDialog(this.getDialogConfig());
        break;
      case 'Edit':
        this.leaveDataForSpecificDate.set(data!);
        console.log('dataaaa', data);

        this.dialogBridge.requestOpenForm({
          selectedDate: new Date(),
          header: `Apply Leave`,
          data: data,
          formType: 'edit',
          requestedBy: 'edit',
        });
    }
  }

  normalizeDate(date: Date | string): Date | undefined {
    if (!date) return;
    const d = date instanceof Date ? date : new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // time = 00:00:00
  }

  getLeaveTypeValueFromKey(key: string) {
    let leaveTypeValue = '';

    this.leaveTypes()!.forEach((l) => {
      if (l.key === key) {
        leaveTypeValue = l.value;
      }
    });
    return leaveTypeValue;
  }

  getApprovalStatuskeys() {
    return approvalStatusKeys;
  }

  onItemSelected(value: string) {
    this.option.set(value);
  }

  readonly approvalStatues = input<ICatalog[]>();

  filteredLeaves = computed(() => {
    const allLeaves = this.latestLeavesData();
    const selected = this.option();

    if (selected === 'All') return allLeaves;

    const matchingStatus = this.approvalStatues()!.find(
      (status) => status.value === selected
    );

    if (!matchingStatus) {
      // If no matching status found, return all leaves or empty array (your choice)
      return allLeaves;
    }

    return allLeaves.filter(
      (leave) => leave.approvalStatusKey === matchingStatus.key
    );
  });

  getLeavesOnStatus(key: string) {
    return this.latestLeavesData().filter(
      (leave) => leave.approvalStatusKey === key
    );
  }
}
