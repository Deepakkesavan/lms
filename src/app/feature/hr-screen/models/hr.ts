import { TemplateRef } from '@angular/core';
import {
  HrCardKey,
  IReusableDictionary,
} from '../../../shared/literal-types/literal-types';

export interface IEmployeeLeaveDetails {
  employeeName: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
}

export interface ICardConfig {
  title: string;
  iconColor: string;
  iconClassName: string;
  iconBackgroundColor: string;
  count?: number;
  description?: string;
  customTemplate?: TemplateRef<any> | null;
}

export interface ILeaveReport{
  today: IReusableDictionary<string, number>;
  lastWeek: IReusableDictionary<string, number>;
  lastMonth: IReusableDictionary<string, number>;
  lastYear: IReusableDictionary<string, number>;
}

export interface ILOPReport{
  month: string;
  lop: number;
}

export interface IReport<T>{
  today: T;
  lastWeek: T;
  lastMonth: T;
  lastYear: T;
}

export interface IProjectReport{
  projectName: string;
  leaveTypes: IReusableDictionary<string, number>;
}

export interface IEmployeeLeaveDetailsConfig {
  data: any[];
}

export interface AssigneeResponse {
  employeeId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  roleId: string;
  roleName: string;
  onLeave: boolean;
  onWrh: boolean;
  onAvailable: boolean;
  onSpecialLeave: boolean;
  contactNumber?: number;
}

export interface IHrCardDetails {
  card: {
    HrView: AssigneeResponse[];
  };
}

export interface IHrCardConfig {
  title: string;
  iconClassName: string;
  iconColor: string;
  iconBackgroundColor: string;
  count: number;
  description: string;
  details: any;
  customTemplate?: TemplateRef<any> | null;
}

export interface IHrCardDetails {
  card: IReusableDictionary<HrCardKey, AssigneeResponse[]>;
}

export interface IPendingApproval{
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  leaveTypeKey: string;
  reason?: string;
  firstName?: string;
  lastName?:string;
}
