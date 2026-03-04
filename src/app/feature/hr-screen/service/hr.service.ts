import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IHrCardDetails,
  ILOPReport,
  ILeaveReport,
  IPendingApproval,
  IProjectReport,
  IReport,
} from '../models/hr';
import { HttpClient } from '@angular/common/http';
import { runtimeConfig } from 'config/runtime-config';
import { getBackendUrl } from 'util/getBackendUrl';

@Injectable({
  providedIn: 'root',
})
export class HrService {
  private readonly baseUrl = getBackendUrl('workforce', 'lms');
  private readonly _http = inject(HttpClient);

  //Method to get all employee details for cards
  getDataStat(): Observable<IHrCardDetails> {
    // console.log(this.baseUrl);

    return this._http.post<IHrCardDetails>(
      `${this.baseUrl}/Lms/hr/data-stats`,
      {}
    );
  }

  getEmployeesLeaveReport(): Observable<ILeaveReport> {
    return this._http.post<ILeaveReport>(
      `${this.baseUrl}/Lms/hr/employees-leave-report`,
      null
    );
  }

  getProjects(): Observable<string[]> {
    return this._http.post<string[]>(`${this.baseUrl}/Lms/hr/projects`, null);
  }

  getProjectLeaveReport(): Observable<IReport<IProjectReport[]>> {
    return this._http.post<IReport<IProjectReport[]>>(
      `${this.baseUrl}/Lms/hr/project-leave-report`,
      null
    );
  }

  getPendingLeaves(): Observable<IPendingApproval[]> {
    return this._http.post<IPendingApproval[]>(
      `${this.baseUrl}/Lms/hr/pending-employees`,
      null
    );
  }

  getLopReport(): Observable<ILOPReport[]> {
    return this._http.post<ILOPReport[]>(
      `${this.baseUrl}/Lms/hr/lop-report`,
      null
    );
  }
}
