import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateLeavePayload } from '../../../../shared/models/common';
import {
  IHolidayDetails,
  ILeaveDetails,
  ILeaveTypeCard,
} from '../../../../shared/models/dashboard';
import { SharedService } from '../../../../shared/shared.service';
import { runtimeConfig } from 'config/runtime-config';
import { getBackendUrl } from 'util/getBackendUrl';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // private readonly baseUrl: string = runtimeConfig.backendUrl;
  private readonly baseUrl = getBackendUrl('workforce', 'lms');
  // private readonly baseUrl: string = 'http://localhost:5006/lmsapi/api';

  private readonly http = inject(HttpClient);
  private readonly sharedService = inject(SharedService);

  //Method to get list of holidays
  getHolidayDetails(): Observable<IHolidayDetails[]> {
    const body = {
      year: new Date().getFullYear(),
    };

    console.log(this.baseUrl);

    return this.http.post<IHolidayDetails[]>(
      `${this.baseUrl}/Lms/holidays`,
      body
    );
  }

  //Method to get all leaves details for an employee
  getLeaveDetails(): Observable<ILeaveDetails[]> {
    return this.http.post<ILeaveDetails[]>(
      `${this.baseUrl}/Lms/employee-leave`,
      {}
    );
  }

  //Method to apply leave
  addLeaveDetails(leaveDetails: ILeaveDetails): Observable<ILeaveDetails> {
    return this.http.post<ILeaveDetails>(
      `${this.baseUrl}/Lms/employee-leave/add`,
      leaveDetails
    );
  }

  //Method to apply leave
  updateLeaveDetails(leaveDetails: ILeaveDetails): Observable<ILeaveDetails> {
    return this.http.patch<ILeaveDetails>(
      `${this.baseUrl}/Lms/employee-leave/update`,
      leaveDetails
    );
  }

  //Method to apply leave
  saveLeaveDetailsAsDraft(
    leaveDetails: ILeaveDetails
  ): Observable<ILeaveDetails> {
    return this.http.post<ILeaveDetails>(
      `${this.baseUrl}/Lms/employee-leave/save-as-draft`,
      leaveDetails
    );
  }

  //Method to delete leave
  cancelLeaveDetails(leaveId: string): Observable<ILeaveDetails> {
    return this.http.delete<ILeaveDetails>(
      `${this.baseUrl}/Lms/employee-leave/delete`,
      { body: { leaveId: leaveId } }
    );
  }

  //Method to get leavebalance(based on leave type) details
  getDashboardCardData(): Observable<ILeaveTypeCard> {
    return this.http.post<ILeaveTypeCard>(
      `${this.baseUrl}/Lms/leave-type-details`,
      {}
    );
  }
}
