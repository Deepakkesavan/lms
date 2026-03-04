import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  IApproverCardDetails,
  ILeaveApprovalDetails,
  ILeaveRequestData,
} from '../models/approver';
import { Observable } from 'rxjs';
import { runtimeConfig } from 'config/runtime-config';
import { getBackendUrl } from 'util/getBackendUrl';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly baseUrl = getBackendUrl('workforce', 'lms');
  // private readonly baseUrl = runtimeConfig.backendUrl;
  // private readonly baseUrl = 'http://localhost:5006/lmsapi/api';
  private http = inject(HttpClient);

  getEmployeeLeaveRequests(): Observable<ILeaveRequestData[]> {
    return this.http.post<ILeaveRequestData[]>(
      `${this.baseUrl}/Lms/manager/employee-leaves`,
      {}
    );
  }

  getApproverData(managerId: string): Observable<IApproverCardDetails> {
    return this.http.post<IApproverCardDetails>(
      `${this.baseUrl}/Lms/manager/data-stats`,
      {}
    );
  }

  updateEmployeeLeaveRequest(
    leaveRequest: ILeaveApprovalDetails
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/Lms/manager/employee-leaves`,
      leaveRequest
    );
  }
}
