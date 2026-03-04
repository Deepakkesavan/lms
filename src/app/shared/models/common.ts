import { ILeaveDetails } from './dashboard';

export interface ITeamIcon {
  [key: string]: any;
  employeeFirstName: string;
  employeeLastName: string;
}

export type IMoreUserInfo = Record<string, any>;

export interface IPublicHolidays {
  holidayName: string;
  date: string;
}

export interface ILeaveHistory {
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  approvalStatus: string;
}

export interface IFormConfig {
  fieldStyles: string;
  fieldType: string;
  fieldControlName: string;
  fieldId: string;
  fieldLabel: string;
}

export interface ICatalog {
  key: string;
  value: string;
}
export interface IFormConfig {
  fieldStyles: string;
  fieldType: string;
  fieldControlName: string;
  fieldId: string;
  fieldLabel: string;
}

export interface IDataStatCardConfig {
  title: string;
  iconClassName: string;
  iconColor: string;
  iconBackgroundColor: string;
  count: number;
  details: any[];
  customTemplate?: any;
}

export interface ITeamIconsConfig {
  data: any[];
  iconColor?: string;
  iconBackgroundColor?: string;
  arrowColor?: string;
  icon?: string;
}

export interface IDetailedTeamMemberDataConfig {
  data: any[];
  enableGridView?: boolean;
  enableListView?: boolean;
}

export interface ILeaveReportConfig {
  key: string;
  label: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
}
export interface ILeaveTypes {
  leaveType: string;
  backgroundColor: string;
  color: string;
}

export interface UpdateLeavePayload {
  oldLeave: ILeaveDetails;
  newLeave: ILeaveDetails;
}

export interface ISessionDetails {
  employeeId: string;
  designation: string;
}
