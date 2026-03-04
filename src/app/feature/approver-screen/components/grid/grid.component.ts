import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import {
  DialogConfig,
  DialogService,
  IGridConfig,
  NgceComponentsModule,
  PositionConfig,
  SnackbarService,
} from '@clarium/ngce-components';
import { DataService } from '../../service/data.service';
import {
  ILeaveApprovalDetails,
  ILeaveRequestData,
} from '../../models/approver';
import { ICatalog } from '../../../../shared/models/common';
import { SharedService } from '../../../../shared/shared.service';
import { approvalStatusKeys } from '../../../../shared/literal-types/literal-types';

@Component({
  selector: 'lms-grid',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule, CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  gridConfig!: IGridConfig;
  leaveHistoryGridConfig!: IGridConfig;
  leaveCatalog = input<ICatalog[]>([]);
  employeeLeaveRequestsData = input<ILeaveRequestData[]>([]);
  localLeaveRequest = signal<ILeaveRequestData[]>([]);

  readonly defaultemployeeDetails: ILeaveRequestData = {
    employeeId: '',
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    approvalStatus: '',
    days: 0,
    employeeName: '',
    reason: '',
    leaveId: '',
  };
  employeeDetails = signal<ILeaveRequestData>(this.defaultemployeeDetails);

  readonly approve: string = 'Approve';
  readonly reject: string = 'Reject';
  readonly cancel: string = 'Cancel';
  approvalStatus = '';
  readonly approveDialogContent: string =
    'This action will approve the selected request. Are you sure you want to continue?';
  readonly rejectDialogContent: string =
    "You're about to reject this request. This action cannot be undone. Do you want to proceed?";

  status = viewChild<TemplateRef<string>>('status');
  startDate = viewChild<TemplateRef<Date>>('startDate');
  endDate = viewChild<TemplateRef<Date>>('endDate');
  dialogContent = viewChild<TemplateRef<unknown>>('dialogContent');

  private dialogService: DialogService = inject(DialogService);
  private snackbarService: SnackbarService = inject(SnackbarService);
  private shardService: SharedService = inject(SharedService);
  private dataService: DataService = inject(DataService);

  constructor() {
    effect(() => {
      const input = this.employeeLeaveRequestsData();
      console.log('inout', input);

      if (input.length > 0) {
        this.localLeaveRequest.set([...input]);
      }
    });
  }

  readonly gridConfigComputed = computed(() => {
    const data: IGridConfig = {
      columns: [
        {
          field: 'employeeId',
          header: 'Employee ID',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'employeeName',
          header: 'Employee Name',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'leaveType',
          header: 'Type',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'startDate',
          header: 'Start Date',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'date',
          filterable: true,
          customTemplate: this.startDate(),
        },
        {
          field: 'endDate',
          header: 'End Date',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'date',
          filterable: true,
          customTemplate: this.endDate(),
        },
        {
          field: 'days',
          header: 'Days',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: false,
        },
        {
          field: 'reason',
          header: 'Reason',
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: false,
          minWidth: 300,
        },
        {
          field: '',
          header: 'Action',
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
          customTemplate: this.status(),
        },
      ],
      data: this.localLeaveRequest(),
      sorting: {
        enabled: true,
      },
      pagination: {
        enabled: true,
        defaultVariant: false,
        pageDetails: true,
        pageSize: 5,
      },
      draggable: true,
      filtering: {
        enabled: true,
        globalFilter: true,
        globalSearch: true,
      },
      export: {
        enabled: false,
        formats: ['csv', 'excel', 'pdf'],
      },
      theme: {
        darkMode: false,
        customStyles: {},
      },
      dataAlign: 'left',
    };
    return data;
  });

  private getDialogConfig(): DialogConfig {
    const dialogconfig: DialogConfig = {
      content: this.dialogContent()!,
      header: 'Confirmation',
      dialogType: 'classic',
      width: '600px',
      height: 'fit-content',
      closeOnBackdropClick: false,
      accessibility: true,
      draggable: false,
      closeButton: false,

      styles: {
        dialog: { padding: '0' },
        header: {
          backgroundColor: 'var(--neutral-light)',
          padding: '10px',
        },
        body: {
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
        },
      },
    };
    return dialogconfig;
  }

  onStatusClick(status: string, row: ILeaveRequestData) {
    this.approvalStatus = status;
    this.employeeDetails.set(row);
    console.log(row);

    console.log('Emp leave details', this.employeeDetails());

    this.dialogService.openDialog(this.getDialogConfig());
  }

  onActionClick(status: string) {
    this.approvalStatus = status;
    this.dialogService.closeDialog();
    switch (this.approvalStatus) {
      case this.approve:
        this.dataService
          .updateEmployeeLeaveRequest(
            this.returnLeaveApproval(
              approvalStatusKeys.APPROVED,
              this.employeeDetails()
            )
          )
          .subscribe({
            next: (response: { message: string }) => {
              this.updateLeaveRequestData();

              this.showSnackbar(response.message);
            },
            error: (err) => {
              this.showErrorSnackbar(err.message);
            },
          });
        break;
      case this.reject:
        this.dataService
          .updateEmployeeLeaveRequest(
            this.returnLeaveApproval(
              approvalStatusKeys.REJECTED,
              this.employeeDetails()
            )
          )
          .subscribe({
            next: (response: { message: string }) => {
              this.updateLeaveRequestData();
              this.showSnackbar(response.message);
            },
            error: (err) => {
              this.showErrorSnackbar(err.message);
            },
          });
        break;
    }
  }

  private returnLeaveApproval(
    approvalkey: string,
    employee: ILeaveRequestData
  ): ILeaveApprovalDetails {
    const catalog: ICatalog = this.shardService.getCatalogUsingValue(
      this.leaveCatalog(),
      employee.leaveType
    );
    console.log('Em', employee);

    return {
      employeeId: employee.employeeId,
      approvalKey: approvalkey,
      startDate: employee.startDate,
      endDate: employee.endDate,
      leaveKey: catalog.key,
      leaveId: employee.leaveId,
    };
  }

  private showSnackbar(message: string) {
    const positionConfig: PositionConfig = {
      horizontal: 'center',
      vertical: 'top',
    };
    this.snackbarService.show(
      message,
      'success',
      positionConfig,
      3000,
      '❌',
      'rotateFade'
    );
  }

  private showErrorSnackbar(message: string) {
    const positionConfig: PositionConfig = {
      horizontal: 'center',
      vertical: 'top',
    };
    this.snackbarService.show(
      message,
      'danger',
      positionConfig,
      3000,
      '❌',
      'rotateFade'
    );
  }

  private updateLeaveRequestData() {
    const updatedData: ILeaveRequestData[] = this.localLeaveRequest().filter(
      (emp) =>
        emp.employeeId !== this.employeeDetails().employeeId ||
        emp.leaveType !== this.employeeDetails().leaveType ||
        emp.startDate !== this.employeeDetails().startDate ||
        emp.endDate !== this.employeeDetails().endDate
    );
    this.localLeaveRequest.set([...updatedData]);
  }
}
