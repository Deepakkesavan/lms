import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '@clarium/ngce-components';
import { Observable } from 'rxjs';
import {
  ICardConfig,
  ILeaveReport,
  IReport,
} from '../feature/hr-screen/models/hr';
import {
  ApproverTitles,
  HrTitles,
  IReusableDictionary,
  TAppearance,
  leaveType,
  leaveTypeKeys,
} from './literal-types/literal-types';
import { ICatalogResponse } from './models/card';
import {
  ICatalog,
  ILeaveReportConfig,
  ILeaveTypes,
  ISessionDetails,
} from './models/common';
import { ILeaveTypeConfig } from './models/dashboard';
import { IAdvanceSidebarNavItems } from '@clarium/ezui-blocks';
import { HR_NAV_ITEMS } from '../screen-access-details/screen-access-details';
import { runtimeConfig } from 'config/runtime-config';
import { getBackendUrl } from 'util/getBackendUrl';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dialogService = inject(DialogService);
  // private baseUrl: string = runtimeConfig.backendUrl;
  private readonly baseUrl = getBackendUrl('workforce', 'lms');
  private navItems = signal<IAdvanceSidebarNavItems[]>(HR_NAV_ITEMS);

  private isDataLoading = signal<boolean>(true);

  constructor(private http: HttpClient) {}

  setIsDataLoadingStatus(isDataLoading: boolean) {
    this.isDataLoading.set(isDataLoading);
  }

  getIsDatalOadingStatus() {
    return this.isDataLoading();
  }
  private leaveTypes = signal<ILeaveTypes[]>([
    { leaveType: 'holiday', backgroundColor: '#FFECB3', color: '' },
    { leaveType: 'weekend', backgroundColor: '#B3E0FF', color: 'var(--dark)' },
    { leaveType: 'leave', backgroundColor: '#FFB6C1', color: '' },
    { leaveType: 'wfh', backgroundColor: '#BFB6C1', color:'' },
    { leaveType: 'drafted', backgroundColor: '#F0F8FF', color: '' },
  ]);

  private hrCardData = signal<ICardConfig[]>([
    {
      title: HrTitles.leave,
      iconClassName: 'ngce-clock-1',
      iconColor: 'rgb(245, 158, 11)',
      iconBackgroundColor: 'rgb(255, 243, 205)',
    },
    {
      title: HrTitles.wfh,
      iconClassName: 'ngce-laptop',
      iconColor: 'rgb(37, 99, 235)',
      iconBackgroundColor: 'rgb(219, 234, 254)',
    },
    {
      title: HrTitles.specialLeaves,
      iconClassName: 'ngce-diamond',
      iconColor: 'rgb(76, 29, 149)',
      iconBackgroundColor: 'rgb(221, 214, 254,.4)',
    },
  ]);

  private approverCardDesigns = signal<ICardConfig[]>([
    {
      title: ApproverTitles.total,
      iconClassName: 'ngce-calendar-8',
      iconColor: 'rgb(59, 130, 246)',
      iconBackgroundColor: 'rgba(239, 246, 255, 1)',
    },
    {
      title: ApproverTitles.available,
      iconClassName: 'ngce-check',
      iconColor: 'rgb(34, 197, 94)',
      iconBackgroundColor: 'rgb(220, 252, 231)',
    },
    {
      title: ApproverTitles.leave,
      iconClassName: 'ngce-clock-1',
      iconColor: 'rgb(245, 158, 11)',
      iconBackgroundColor: 'rgb(255, 243, 205)',
    },
    {
      title: ApproverTitles.wfh,
      iconClassName: 'ngce-laptop',
      iconColor: 'rgb(37, 99, 235)',
      iconBackgroundColor: 'rgb(219, 234, 254)',
    },
  ]);

  private leaveTypeCardConfig = signal<ILeaveTypeConfig[]>([
    {
      type: leaveTypeKeys.CASUAL,
      iconClassName: 'ngce-fog-sun',
      iconBackgroundColor: 'rgba(239, 246, 255, 1)',
      iconColor: 'rgb(59, 130, 246)',
    },
    {
      type: leaveTypeKeys.COMOFF,
      iconClassName: 'ngce-creative-commons',
      iconBackgroundColor: 'rgba(255, 243, 205, 1)',
      iconColor: 'rgb(245, 158, 11)',
    },
    {
      type: leaveTypeKeys.WFH,
      iconClassName: 'ngce-laptop',
      iconBackgroundColor: 'rgba(219, 234, 254, 1)',
      iconColor: 'rgb(37, 99, 235)',
    },
    {
      type: leaveTypeKeys.PRIVILEGE,
      iconClassName: 'ngce-award-2',
      iconBackgroundColor: 'rgba(232, 241, 250, 1)',
      iconColor: 'rgb(30, 64, 175)',
    },
    {
      type: leaveTypeKeys.SICK,
      iconClassName: 'ngce-stethoscope',
      iconBackgroundColor: 'rgba(254, 226, 226, 1)',
      iconColor: 'rgb(239, 68, 68)',
    },
    {
      type: leaveTypeKeys.PATERNITY,
      iconClassName: 'ngce-child',
      iconBackgroundColor: 'rgba(254, 249, 195, 1)',
      iconColor: 'rgb(202, 138, 4)',
    },
    {
      type: leaveTypeKeys.MATERNITY,
      iconClassName: 'ngce-child',
      iconBackgroundColor: 'rgba(254, 249, 195, 1)',
      iconColor: 'rgb(202, 138, 4)',
    },
    {
      type: leaveTypeKeys.LOP,
      iconClassName: 'ngce-warning-empty',
      iconBackgroundColor: 'rgba(243, 244, 246, 1)',
      iconColor: 'rgb(107, 114, 128)',
    },
  ]);

  private employeesLeavesReportConfig = signal<ILeaveReportConfig[]>([
    {
      key: leaveTypeKeys.CASUAL,
      label: 'Casual',
      backgroundColor: 'rgb(34, 197, 94, .5)',
      hoverBackgroundColor: 'rgb(34, 197, 94)',
    },
    {
      key: leaveTypeKeys.SICK,
      label: 'Sick',
      backgroundColor: 'rgb(59, 130, 246, .5)',
      hoverBackgroundColor: 'rgb(59, 130, 246)',
    },
    {
      key: leaveTypeKeys.WFH,
      label: 'WFH',
      backgroundColor: 'rgb(245, 158, 11, .5)',
      hoverBackgroundColor: 'rgb(245, 158, 11)',
    },
    {
      key: leaveTypeKeys.PATERNITY,
      label: 'Paterntiy',
      backgroundColor: 'rgb(191, 239, 255, .5)',
      hoverBackgroundColor: 'rgb(191, 239, 255)',
    },
    {
      key: leaveTypeKeys.MATERNITY,
      label: 'Maternity',
      backgroundColor: 'rgb(255, 182, 193, .5)',
      hoverBackgroundColor: 'rgb(255, 182, 193)',
    },
    {
      key: leaveTypeKeys.PRIVILEGE,
      label: 'Privilege',
      backgroundColor: 'grey',
      hoverBackgroundColor: 'grey',
    },
  ]);

  private dropdownConfig = signal<IReusableDictionary<string, string>>({
    today: 'Today',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',
    lastYear: 'Last Year',
  });

  private doughnutLabelConfig = signal<IReusableDictionary<leaveType, string>>({
    casual: 'Casual',
    sick: 'Sick',
    privilege: 'Privilege',
    WFH: 'WFH',
    paternity: 'Paternity',
    maternity: 'Maternity',
    compoff: 'Compensatory off',
    LOP: 'LOP',
  });

  getEmployeeLeaveReportConfig(): ILeaveReportConfig[] {
    return this.employeesLeavesReportConfig();
  }

  getDoughnutLabelConfig(): IReusableDictionary<string, string> {
    return this.doughnutLabelConfig();
  }

  getDropdownConfig(): IReusableDictionary<string, string> {
    return this.dropdownConfig();
  }

  getDropdownValue(key: string): string {
    return this.dropdownConfig()[key];
  }

  getDropdownKey(value: string): string {
    let label = '';
    const config = this.dropdownConfig();
    for (const key in config) {
      if (config[key] === value) {
        label = key;
        break;
      }
    }
    return label;
  }

  isLeaveReportKey(key: string, data: ILeaveReport): key is keyof ILeaveReport {
    return Object.keys(data).includes(key);
  }

  isReportKey<T extends object>(
    key: string,
    data: IReport<T>
  ): key is keyof IReport<T> {
    return Object.keys(data).includes(key);
  }

  // Get color by leave type
  getColor(leaveType: string): string | undefined {
    return this.leaveTypes().find((t) => t.leaveType === leaveType)
      ?.backgroundColor;
  }

  getLeaveTypeCardConfig(): ILeaveTypeConfig[] {
    this.getCatalogs();
    return this.leaveTypeCardConfig();
  }

  //Method to get all the leave types to display in calendar
  getLeaveTypes = this.leaveTypes.asReadonly();

  //Method to get approver card design details
  getHrCardDesigns() {
    return this.hrCardData();
  }

  //Method to get approver card design details
  getApproverCardDesigns() {
    return this.approverCardDesigns();
  }

  getCatalogUsingKey(catalogs: ICatalog[], key: string): ICatalog {
    const catalog: ICatalog | undefined = catalogs.find(
      (catalog) => catalog.key === key
    );
    return catalog ?? { key: '', value: '' };
  }

  getCatalogUsingValue(catalogs: ICatalog[], value: string): ICatalog {
    const catalog: ICatalog | undefined = catalogs.find(
      (catalog) => catalog.value === value
    );
    return catalog ?? { key: '', value: '' };
  }

  // The following method call the catalog API and return the list of catalogs with their respective type.
  getCatalogs(): Observable<ICatalogResponse> {
    //
    return this.http.post<ICatalogResponse>(
      `${this.baseUrl}/Lms/catalogs`,
      null
    );
  }

  closeTheDialog() {
    this.dialogService.closeDialog();
  }
  appearance: TAppearance = 'none';

  getCardStyles() {
    const cardStyles = {
      cursor: 'default',
      border: '1px solid rgb(229 ,231 ,235)',
      'background-color': 'white',
      height: '100%',
      width: 'auto',
    };
    return cardStyles;
  }

  getDashboardCardStyles() {
    const cardStyles = {
      padding: '1.5rem',
      width: '19rem',
      cursor: 'pointer',
      border: '1px solid rgb(229 ,231 ,235 )',
      'background-color': 'white',
      height: 'max-content',
    };
    return cardStyles;
  }

  convertUtcToLocalDate(utcString: string): Date | null {
    if (!utcString) return null;

    const localDate = new Date(utcString);
    return isNaN(localDate.getTime()) ? null : localDate;
  }

  private convertStringToDate(dateStr: string): Date | null {
    const datePart = dateStr.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    date.setHours(5, 30, 0, 0); // Set time to 05:30:00 local
    return date;
  }

  private createDate(
    dateStr: Date,
    hour: number,
    min: number,
    sec: number,
    ms: number
  ) {
    const date = new Date(dateStr.getTime());
    date.setHours(hour, min, sec, ms);
    return date;
  }

  private isSameDate(d1: Date | null, d2: Date | null): boolean {
    if (!d1 || !d2) {
      return false;
    }
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  private parseToLocal530(
    dateStr: string | Date | null | undefined
  ): Date | null {
    if (!dateStr) {
      return null;
    }

    if (typeof dateStr === 'string') {
      return this.convertStringToDate(dateStr);
    }

    if (dateStr instanceof Date) {
      return this.createDate(dateStr, 5, 30, 0, 0);
    }

    return null;
  }

  convertLeaveDates(data: any): any {
    const convertItem = (item: any) => {
      const start = this.parseToLocal530(item.startDate);
      const end = this.parseToLocal530(item.endDate);

      if (this.isSameDate(start, end) && start) {
        return {
          ...item,
          startDate: start,
          endDate: new Date(start.getTime()),
        };
      }

      return { ...item, startDate: start, endDate: end };
    };
    return Array.isArray(data) ? data.map(convertItem) : convertItem(data);
  }

  getNavItems = computed(() => this.navItems());

  setNavItems(items: IAdvanceSidebarNavItems[]) {
    this.navItems.set(items);
  }

  private sessionDetails = signal<ISessionDetails>(
    this.loadSessionDetailsFromsessionStorage()
  );

  getSessionDetails = computed(() => this.sessionDetails());

  setSessionDetails(sessionDetails: ISessionDetails) {
    this.sessionDetails.set(sessionDetails);
    sessionStorage.setItem('sessionDetails', JSON.stringify(sessionDetails));
  }
  private loadSessionDetailsFromsessionStorage() {
    const storedSessionDetails = sessionStorage.getItem('userInfo');
    if (storedSessionDetails) {
      try {
        const details = JSON.parse(storedSessionDetails);

        return {
          employeeId: details.empId,
          designation: details.designation,
        } as ISessionDetails;
      } catch {
        return { employeeId: '', designation: '' };
      }
    }
    return { employeeId: '', designation: '' };
  }
}
