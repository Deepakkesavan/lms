import {
  IReusableDictionary,
  LeaveTypeCardKey,
} from '../literal-types/literal-types';

export interface IHolidays {
  holidayName: string;
  date: string;
}

export interface ILeaveTypeCard {
  card: IReusableDictionary<LeaveTypeCardKey, IDashboardCardDetails[]>;
}

export interface ILatestLeaves {
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  approvalStatus: string;

  isHalfDay: boolean;
}

export interface IDashboardCardDetails {
  leaveType: string;
  available: number;
  booked: number;
  iconClassName?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
}

export interface ILeaveTypeConfig {
  type: string;
  iconClassName: string;
  iconBackgroundColor: string;
  iconColor: string;
}

export interface IHolidayDetails {
  name: string;
  description: string;
  date: Date;
}

export interface IEmployeeLeaveResponse {
  LeaveTypeKey: string;
  ApprovalStatusKey: string;
  StartDate: Date;
  EndDate: Date;
  EmployeeId: string;
  Reason: string;
  isHalfDay: boolean;
}

export interface IEmployeeLeaveRequest {
  LeaveTypeKey: string; // required
  StartDate: Date; // required
  EndDate: Date;
  EmployeeId: string; // required
  Reason: string;
  ApprovalStatus?: string; // optional (nullable)

  isHalfDay: boolean;
}

export interface ILeaveDetails {
  leaveTypeKey: string;
  approvalStatusKey?: string;
  startDate: string;
  endDate: string;
  reason: string;
  requestedDays?: number;
  isHalfDay: boolean;
  leaveId: string;
}

export interface ILeaveHistoryGrid {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  requestedDays?: number;
  isHalfDay: boolean;
}

export interface ILeaveReqPayload {
  leaveTypeKey: string;
  approvalStatusKey?: string;
  startDate: Date;
  endDate: Date;
  employeeId?: string;
  reason: string;
  requestedDays?: number;
  isHalfDay: boolean;
}
