import { AssigneeResponse } from '../../hr-screen/models/hr';
import {
  IReusableDictionary,
  ManagerCardKey,
} from '../../../shared/literal-types/literal-types';

export interface ILeaveRequestData {
  employeeName: string;
  leaveType: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  approvalStatus: string;
  reason: string;
  leaveId: string;
}

export interface ILeaveApprovalDetails {
  employeeId: string;
  leaveKey: string;
  startDate: Date;
  endDate: Date;
  approvalKey: string;

  leaveId: string;
}

// Final response type
export interface IApproverCardDetails {
  card: IReusableDictionary<ManagerCardKey, AssigneeResponse[]>;
}
