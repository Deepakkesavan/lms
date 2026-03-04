import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveBalanceService } from '../leave-balance-service/leave-balance.service';
import { ILeaveDetails } from '../models/dashboard';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveDetailsService {
  private leaveBalanceService = inject(LeaveBalanceService);
  private sharedService = inject(SharedService);
  private leaveDetailsSubject = new BehaviorSubject<ILeaveDetails[]>([]);

  leaveDetails$ = this.leaveDetailsSubject.asObservable();

  setLeaveDetails(leaveDetailsList: ILeaveDetails[]) {
    this.leaveDetailsSubject.next(
      this.sharedService.convertLeaveDates(leaveDetailsList)
    );
  }

  addLeaveDetails(newLeave: ILeaveDetails) {
    const current = this.sharedService.convertLeaveDates(
      this.leaveDetailsSubject.value
    );
    const newLeaveData = this.sharedService.convertLeaveDates(newLeave);
    this.leaveDetailsSubject.next([...current, newLeaveData]);
  }

  updateLeaveDetails(newLeave: ILeaveDetails, existingLeave: ILeaveDetails) {
    const current = this.leaveDetailsSubject.value;

    const updateLeaveDetails = current.filter((leaveDetail) => {
      return !(
        leaveDetail.startDate === existingLeave.startDate &&
        leaveDetail.endDate === existingLeave.endDate &&
        leaveDetail.leaveTypeKey === existingLeave.leaveTypeKey
      );
    });

    updateLeaveDetails.push(newLeave);

    this.leaveDetailsSubject.next([...updateLeaveDetails]);
  }

  removeLeaveDetails(cancelledLeave: ILeaveDetails) {
    const current = this.leaveDetailsSubject.value;
    const updatedLeaveDetails = current.filter(
      (l) =>
        l.startDate != cancelledLeave.startDate &&
        l.endDate != cancelledLeave.endDate &&
        l.leaveTypeKey != cancelledLeave.leaveTypeKey
    );
    this.leaveDetailsSubject.next(updatedLeaveDetails);
  }
}
