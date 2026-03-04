export type POSITION = 'top' | 'right' | 'bottom' | 'left' | undefined;

export type EASING =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | undefined;

export type MODE =
  | 'x'
  | 'y'
  | 'dataset'
  | 'index'
  | 'point'
  | 'nearest'
  | undefined;

export interface DELAY {
  type: string;
  mode: string;
  dataIndex: number;
  datasetIndex: number;
}

export type TAppearance = 'outlined' | 'raised' | 'none';

export enum leaveTypeKeys {
  CASUAL = 'casual',
  COMOFF = 'compoff',
  SICK = 'sick',
  WFH = 'WFH',
  PRIVILEGE = 'privilege',
  PATERNITY = 'paternity',
  MATERNITY = 'maternity',
  LOP = 'LOP',
}

export type leaveType = leaveTypeKeys;

export enum approvalStatusKeys {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  Drafted = 'draft',
}

export interface IPayload {
  source: 'card' | 'calendar' | 'request' | 'latest-leaves';
  data?: any;
}

export type LeaveTypeCardKey = 'LeaveTypeCard';
export type CatalogCardKey = 'Catalog';
export type LeaveTypeKey = 'Leave';
export type GenderTypeKey = 'Gender';
export type ApprovalStatusKey = 'Approval Status';
export type LeaveDayType = 'LeaveDayType';

export type ManagerCardKey = 'ManagerView'; // extend if needed

export type HrCardKey = 'HrView';

export type IReusableDictionary<U extends string, T> = Record<U, T>;

export const HrTitles = {
  leave: 'Leave',
  specialLeaves: 'Special Leaves',
  wfh: 'Work From Home',
};

export const ApproverTitles = {
  leave: 'Leave',
  specialLeaves: 'Special Leaves',
  wfh: 'Work From Home',
  available: 'Available',
  total: 'Total',
};
