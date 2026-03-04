import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IDashboardCardDetails,
  ILeaveTypeConfig,
} from '../models/dashboard';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { ICatalog } from '../models/common';
@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  private http = inject(HttpClient);

  private leaveBalanceSubject = new BehaviorSubject<IDashboardCardDetails[]>(
    []
  );
  leaveBalance$ = this.leaveBalanceSubject.asObservable();

  private sharedService = inject(SharedService);

  configData: ILeaveTypeConfig[] = this.sharedService.getLeaveTypeCardConfig();
  leaveTypes!: ICatalog[];
  //Method sets the configuration for cards
  setConfigData(cardData: IDashboardCardDetails[]): IDashboardCardDetails[] {
    cardData.forEach((data) => {
      this.configData.forEach((config) => {
        if (this.validateKeys(data.leaveType, config.type)) {
          data.iconClassName = config.iconClassName;
          data.iconBackgroundColor = config.iconBackgroundColor;
          data.iconColor = config.iconColor;
        }
      });

      data.leaveType = this.sharedService.getCatalogUsingKey(
        this.leaveTypes,
        data.leaveType
      ).value;
    });

    return cardData;
  }

  validateKeys(dataKey: string, configKey: string): boolean {
    return dataKey === configKey;
  }

  getLeaveBalanceData() {
    return this.leaveBalanceSubject.value;
  }

  refreshLeaveBalanceData() {
    this.sharedService.getCatalogs().subscribe({
      next: (response) => {
        this.leaveTypes = response.catalogs.Leave;
      },
    });
  }

  getLeaveBalanceByType(LeaveType: string) {
    let leaveBalanceByType = null;
    if (this.leaveBalanceSubject.value) {
      const current = this.leaveBalanceSubject.value;
      leaveBalanceByType = current.find((lb) => lb.leaveType == LeaveType);
    }

    return leaveBalanceByType;
  }

  setLeaveBalance(data: IDashboardCardDetails[]) {
    this.leaveBalanceSubject.next(data);
  }
}
