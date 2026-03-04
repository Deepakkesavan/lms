import { Injectable, inject, signal } from '@angular/core';
import { DialogService, SnackbarService } from '@clarium/ngce-components';
import { of } from 'rxjs';
import { UpdateLeavePayload } from '../shared/models/common';
import {
  IHolidayDetails,
  ILeaveDetails,
  ILeaveTypeCard,
} from '../shared/models/dashboard';
import { SharedService } from '../shared/shared.service';
import { EmployeeService } from '../feature/employee-screen/service/employee/employee.service';

@Injectable({ providedIn: 'root' })
export class EmployeeStoreService {
  private readonly employeeService = inject(EmployeeService);
  private readonly sharedService = inject(SharedService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialogService = inject(DialogService);

  private _employeeLeaveDetails = signal<ILeaveDetails[]>([]);
  employeeLeaveDetails = this._employeeLeaveDetails.asReadonly();

  holidayDetails = signal<IHolidayDetails[]>([]);
  leaveBalanceData = signal<ILeaveTypeCard | null>(null);
  catalogData = signal<any>({});

  reset() {
    this._employeeLeaveDetails.set([]);
  }

  constructor() {
    this.loadLeaveDetails();
    this.loadHolidayDetails();
    this.loadLeaveBalance();
    this.loadCatalogData();
  }

  public loadLeaveDetails() {
    this.employeeService.getLeaveDetails().subscribe({
      next: (data) => {
        this._employeeLeaveDetails.set(data);
      },
      error: () => {
        this._employeeLeaveDetails.set([]);
      },
    });
  }

  public loadLeaveBalance() {
    this.employeeService.getDashboardCardData().subscribe({
      next: (data) => this.leaveBalanceData.set(data),
      error: () => this.leaveBalanceData.set(null),
    });
  }

  public loadHolidayDetails() {
    this.employeeService.getHolidayDetails().subscribe({
      next: (data) => this.holidayDetails.set(data),
      error: () => this.holidayDetails.set([]),
    });
  }

  public loadCatalogData() {
    this.sharedService.getCatalogs().subscribe({
      next: (data) => {
        this.catalogData.set(data);
      },
      error: () => this.catalogData.set({}),
    });
  }

  addLeaveDetails(newLeave: ILeaveDetails) {
    this.employeeService.addLeaveDetails(newLeave).subscribe({
      next: (data) => {
        this.loadLeaveBalance();
        this._employeeLeaveDetails.update((leaves) => [...leaves, data]);
        this.dialogService.closeDialog();
        this.snackbarService.show('Applied leave successfully', 'success');
      },
      error: (err) => {
        this.dialogService.closeDialog();
        console.log(err);

        this.snackbarService.show(
          err.message || 'Failed to apply leave',
          'danger'
        );
        return of(null);
      },
    });
  }

  updateLeaveDetails(updatedLeave: ILeaveDetails) {
    this.employeeService.updateLeaveDetails(updatedLeave).subscribe({
      next: (changed) => {
        if (changed) {
          this.loadLeaveBalance();
          this._employeeLeaveDetails.update((list) =>
            list.map((item) =>
              item.leaveId === updatedLeave.leaveId ? changed : item
            )
          );
          this.snackbarService.show('Leave updated successfully', 'success');
        }
        this.dialogService.closeDialog();
      },
      error: (err) => {
        this.dialogService.closeDialog();
        this.snackbarService.show(
          err.message || 'Failed to update leave',
          'danger'
        );
      },
    });
  }

  saveLeaveDetailsAsDraft(leaveDetails: ILeaveDetails, oldLeave?: any) {
    this.employeeService.saveLeaveDetailsAsDraft(leaveDetails).subscribe({
      next: (drafted) => {
        if (drafted) {
          if (oldLeave) {
            this.loadLeaveDetails();
            this.snackbarService.show('Draft saved successfully', 'success');
            this.dialogService.closeDialog();
            return;
          }

          const existingIndex = this._employeeLeaveDetails().findIndex(
            (e) => e.leaveId == drafted.leaveId
          );

          if (existingIndex !== -1) {
            this._employeeLeaveDetails.update((leaves) => {
              const updatedLeaves = [...leaves];
              updatedLeaves[existingIndex] = drafted;
              return updatedLeaves;
            });
          } else {
            this._employeeLeaveDetails.update((leaves) => [...leaves, drafted]);
          }

          this.snackbarService.show('Draft saved successfully', 'success');
        }
        this.dialogService.closeDialog();
      },
      error: (err) => {
        this.dialogService.closeDialog();
        this.snackbarService.show(
          err.message || 'Failed to save as draft',
          'danger'
        );
      },
    });
  }

  cancelLeave(leaveId: string) {
    this.employeeService.cancelLeaveDetails(leaveId).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.loadLeaveBalance();
          this.loadLeaveDetails();
          this._employeeLeaveDetails.update((leaves) =>
            leaves.filter((item) => !(item.leaveId === leaveId))
          );
          this.snackbarService.show('Leave cancelled successfully', 'success');
        }
        this.dialogService.closeDialog();
      },
      error: (err) => {
        this.dialogService.closeDialog();
        this.snackbarService.show(
          err.message || 'Failed to cancel leave',
          'danger'
        );
      },
    });
  }

  getLeaveTypeCardConfig = this.sharedService.getLeaveTypeCardConfig();

  leaveTypeAndColors = this.sharedService.getLeaveTypes();
}
